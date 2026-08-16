import { Router } from 'express';
import { prisma } from '../config/database';
import { RsvpResponse } from '@prisma/client';

const router = Router();

// GET /api/invitations/:slug (Public)
router.get('/:slug', async (req, res): Promise<void> => {
  try {
    const { slug } = req.params;

    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      include: {
        template: true,
        rsvps: true,
      },
    });

    if (!invitation) {
      res.status(404).json({ status: 'error', message: 'Invitation not found.' });
      return;
    }

    if (invitation.status !== 'ACTIVE') {
      res.status(410).json({ status: 'error', message: 'This invitation is no longer active.' });
      return;
    }

    // Check expiry date
    if (invitation.expiryDate && new Date() > new Date(invitation.expiryDate)) {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' },
      });
      res.status(410).json({ status: 'error', message: 'Invitation has expired.' });
      return;
    }

    res.json({
      status: 'success',
      invitation,
    });
  } catch (error: any) {
    console.error('Error fetching invitation:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
  }
});

// POST /api/invitations/:slug/rsvp (Public Guest RSVP submission)
router.post('/:slug/rsvp', async (req, res): Promise<void> => {
  try {
    const { slug } = req.params;
    const { guestName, response, guestCount, message } = req.body;

    if (!guestName || !response) {
      res.status(400).json({ status: 'error', message: 'Guest name and RSVP response are required.' });
      return;
    }

    const invitation = await prisma.invitation.findUnique({ where: { slug } });
    if (!invitation) {
      res.status(404).json({ status: 'error', message: 'Invitation not found.' });
      return;
    }

    if (invitation.status !== 'ACTIVE') {
      res.status(400).json({ status: 'error', message: 'RSVP is closed for this invitation.' });
      return;
    }

    const rsvp = await prisma.rsvp.create({
      data: {
        invitationId: invitation.id,
        guestName,
        response: response as RsvpResponse,
        guestCount: parseInt(guestCount || '1', 10),
        message: message || '',
      },
    });

    res.json({
      status: 'success',
      message: 'RSVP response registered successfully.',
      rsvp,
    });
  } catch (error: any) {
    console.error('Error submitting RSVP:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
  }
});

export default router;
