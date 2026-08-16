import { Router, Response } from 'express';
import { prisma } from '../config/database';
import { redis } from '../config/redis';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { env } from '../config/env';
import { generateSlug } from '../utils/slug';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = Router();

// Initialize Razorpay client only if real keys are supplied
let razorpayClient: Razorpay | null = null;
const isMockPayment =
  !env.RAZORPAY_KEY_ID ||
  env.RAZORPAY_KEY_ID === 'rzp_test_mockedkeyid' ||
  !env.RAZORPAY_KEY_SECRET ||
  env.RAZORPAY_KEY_SECRET === 'your-razorpay-test-secret';

if (!isMockPayment) {
  try {
    razorpayClient = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
    console.log('[Payments] Razorpay initialized in TEST mode.');
  } catch (error) {
    console.error('[Payments] Failed to initialize Razorpay Client:', error);
  }
} else {
  console.log('[Payments] Razorpay runs in MOCK/SANDBOX mode.');
}

// POST /api/payments/create-order (Protected)
router.post('/create-order', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { previewId } = req.body;

    if (!userId || !previewId) {
      res.status(400).json({ status: 'error', message: 'User ID and Preview ID are required.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(401).json({ status: 'error', message: 'User session is invalid. Please log in again.', code: 'USER_NOT_FOUND' });
      return;
    }

    const preview = await prisma.preview.findUnique({
      where: { id: previewId },
      include: { template: true },
    });

    if (!preview) {
      res.status(404).json({ status: 'error', message: 'Preview session not found.' });
      return;
    }

    if (preview.status === 'CONVERTED') {
      res.status(400).json({ status: 'error', message: 'This preview was already paid and converted.' });
      return;
    }

    const amount = preview.template.price; // in paise
    const currency = 'INR';

    // Create intermediate order in DB
    const order = await prisma.order.create({
      data: {
        userId,
        previewId: preview.id,
        amount,
        currency,
        paymentStatus: 'PENDING',
      },
    });

    if (razorpayClient) {
      // Create actual Razorpay Order
      try {
        const rpOrder = await razorpayClient.orders.create({
          amount,
          currency,
          receipt: order.id,
        });

        // Update database with gateway order id
        const updatedOrder = await prisma.order.update({
          where: { id: order.id },
          data: { gatewayRef: rpOrder.id },
        });

        res.json({
          status: 'success',
          isMock: false,
          order: updatedOrder,
          razorpayKeyId: env.RAZORPAY_KEY_ID,
        });
        return;
      } catch (err: any) {
        console.error('Razorpay Order creation failed:', err);
        // Fall back to Mock
      }
    }

    // Mock Order creation
    const mockGatewayRef = `order_mock_${crypto.randomBytes(8).toString('hex')}`;
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { gatewayRef: mockGatewayRef },
    });

    res.json({
      status: 'success',
      isMock: true,
      order: updatedOrder,
      razorpayKeyId: 'rzp_test_mockedkeyid',
    });
  } catch (error: any) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
  }
});

// POST /api/payments/verify (Protected fallback verification)
router.post('/verify', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId) {
      res.status(400).json({ status: 'error', message: 'Order ID and Payment ID are required.' });
      return;
    }

    // Find the order
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderId },
          { gatewayRef: orderId }
        ]
      },
      include: {
        preview: {
          include: { template: true }
        }
      }
    });

    if (!order) {
      res.status(404).json({ status: 'error', message: 'Order not found.' });
      return;
    }

    if (order.paymentStatus === 'PAID') {
      const existingInvitation = await prisma.invitation.findUnique({
        where: { orderId: order.id }
      });
      res.json({
        status: 'success',
        message: 'Payment already verified.',
        slug: existingInvitation?.slug,
      });
      return;
    }

    // Check if we verify crypto signature
    const isMock = order.gatewayRef?.startsWith('order_mock_');
    if (!isMock && razorpayClient && signature) {
      // Real verify
      const hmacSecret = env.RAZORPAY_KEY_SECRET;
      const generatedSignature = crypto
        .createHmac('sha256', hmacSecret)
        .update(`${order.gatewayRef}|${paymentId}`)
        .digest('hex');

      if (generatedSignature !== signature) {
        res.status(400).json({ status: 'error', message: 'Cryptographic signature mismatch. Verification failed.' });
        return;
      }
    }

    // Process conversion: order PAID + create Invitation
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Order status
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          paymentId: paymentId,
        },
      });

      // 2. Generate slug for invitation
      let baseString = order.preview.formData
        ? ((order.preview.formData as any).groomName || 'wedding')
        : 'wedding';
      const slug = generateSlug(baseString);

      // 3. Create permanent Invitation record
      // Tier determines expiry (e.g. PREMIUM = 1 year, DELUXE = 2 years, basic = 6 months)
      let expiryDate: Date | null = null;
      const now = new Date();
      if (order.preview.template.tier === 'BASIC') {
        expiryDate = new Date(now.setMonth(now.getMonth() + 6));
      } else if (order.preview.template.tier === 'PREMIUM') {
        expiryDate = new Date(now.setMonth(now.getMonth() + 12));
      }

      const invitation = await tx.invitation.create({
        data: {
          orderId: order.id,
          templateId: order.preview.templateId,
          userId: order.userId,
          finalData: order.preview.formData || {},
          slug,
          expiryDate,
          status: 'ACTIVE',
          ogTitle: `${(order.preview.formData as any).groomName || 'Arjun'} & ${(order.preview.formData as any).brideName || 'Pooja'}'s Wedding Invitation`,
        },
      });

      // 4. Set Preview status to CONVERTED
      await tx.preview.update({
        where: { id: order.previewId },
        data: { status: 'CONVERTED' },
      });

      return { updatedOrder, invitation };
    });

    // Delete preview TTL session from Redis
    const redisKey = `preview:${order.preview.token}`;
    await redis.del(redisKey);

    console.log(`[Payments] Order ${order.id} paid. Invitation created at: /i/${result.invitation.slug}`);

    res.json({
      status: 'success',
      message: 'Payment verified and invitation generated.',
      slug: result.invitation.slug,
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
  }
});

// POST /api/payments/webhook (Razorpay Event Handler)
router.post('/webhook', async (req, res): Promise<void> => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      res.status(400).json({ status: 'error', message: 'Webhook parameters configuration error.' });
      return;
    }

    const payloadString = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payloadString)
      .digest('hex');

    if (expectedSignature !== signature) {
      res.status(400).json({ status: 'error', message: 'Signature validation failed' });
      return;
    }

    const { event, payload } = req.body;

    if (event === 'payment.captured') {
      const payment = payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      // Locate Order
      const order = await prisma.order.findFirst({
        where: { gatewayRef: orderId },
        include: { preview: { include: { template: true } } },
      });

      if (order && order.paymentStatus !== 'PAID') {
        const slug = generateSlug(
          order.preview.formData
            ? ((order.preview.formData as any).groomName || 'wedding')
            : 'wedding'
        );

        let expiryDate: Date | null = null;
        const now = new Date();
        if (order.preview.template.tier === 'BASIC') {
          expiryDate = new Date(now.setMonth(now.getMonth() + 6));
        } else if (order.preview.template.tier === 'PREMIUM') {
          expiryDate = new Date(now.setMonth(now.getMonth() + 12));
        }

        await prisma.$transaction([
          prisma.order.update({
            where: { id: order.id },
            data: { paymentStatus: 'PAID', paymentId },
          }),
          prisma.invitation.create({
            data: {
              orderId: order.id,
              templateId: order.preview.templateId,
              userId: order.userId,
              finalData: order.preview.formData || {},
              slug,
              expiryDate,
              status: 'ACTIVE',
            },
          }),
          prisma.preview.update({
            where: { id: order.previewId },
            data: { status: 'CONVERTED' },
          }),
        ]);

        const redisKey = `preview:${order.preview.token}`;
        await redis.del(redisKey);
        
        console.log(`[Webhook] Order ${order.id} successfully processed from Razorpay Webhook.`);
      }
    }

    res.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
  }
});

export default router;
