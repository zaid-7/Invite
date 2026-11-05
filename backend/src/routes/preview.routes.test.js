const assert = require('node:assert/strict');
const { test, beforeEach } = require('node:test');

let preview;
let order;
let invitation;
let databaseError;
let cacheError;
let transactionEvents;
let previewLock;

const prisma = {
  async $transaction(callback) {
    if (databaseError) throw databaseError;
    let releaseLock;
    try {
      return await callback({
        preview: {
          async findFirst({ where }) {
            return preview && preview.token === where.token && preview.userId === where.userId ? preview : null;
          },
          async update({ data }) {
            const previousLock = previewLock;
            previewLock = new Promise(resolve => { releaseLock = resolve; });
            await previousLock;
            transactionEvents.push('lock-preview');
            Object.assign(preview, data);
            return preview;
          },
        },
        order: {
          async upsert({ create }) {
            transactionEvents.push('upsert-order');
            order ??= { id: 'order-1', ...create };
            return { ...order, invitation };
          },
          async update({ data }) {
            Object.assign(order, data);
            return order;
          },
        },
        invitation: {
          async create({ data }) {
            assert.equal(invitation, null, 'A preview must not create a second invitation');
            invitation = { id: 'invitation-1', ...data };
            return invitation;
          },
        },
      });
    } finally {
      releaseLock?.();
    }
  },
};

function mockModule(path, exports) {
  const filename = require.resolve(path);
  require.cache[filename] = { id: filename, filename, loaded: true, exports };
}

mockModule('../config/database.ts', { prisma });
mockModule('../config/redis.ts', {
  redis: {
    async del(key) {
      assert.equal(key, 'preview:preview-token');
      if (cacheError) throw cacheError;
    },
  },
});

const router = require('./preview.routes.ts').default;
const route = router.stack.find(layer => layer.route?.path === '/:token/unlock').route;
const unlock = route.stack.at(-1).handle;

beforeEach(() => {
  preview = {
    id: 'preview-1',
    token: 'preview-token',
    userId: 'owner-1',
    templateId: 'template-1',
    template: { tier: 'BASIC' },
    formData: { groomName: 'Arjun', brideName: 'Pooja', events: [] },
    status: 'ACTIVE',
  };
  order = null;
  invitation = null;
  databaseError = null;
  cacheError = null;
  transactionEvents = [];
  previewLock = Promise.resolve();
});

async function request(userId = 'owner-1') {
  const response = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  await unlock({
    user: userId ? { userId } : undefined,
    params: { token: 'preview-token' },
  }, response);
  return response;
}

test('unlock is protected by authentication middleware', () => {
  assert.equal(route.stack.length, 2);
  assert.equal(route.stack[0].handle, require('../middleware/auth.ts').authMiddleware);
});

test('publishes saved preview data without a gateway payment', async () => {
  const response = await request();
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.status, 'success');
  assert.equal(response.body.slug, invitation.slug);
  assert.deepEqual(invitation.finalData, preview.formData);
  assert.equal(invitation.userId, 'owner-1');
  assert.equal(invitation.templateId, 'template-1');
  assert.equal(order.amount, 0);
  assert.equal(order.paymentStatus, 'PAID');
  assert.equal(order.gatewayRef, null);
  assert.equal(order.paymentId, null);
  assert.equal(preview.status, 'CONVERTED');
  assert.deepEqual(transactionEvents, ['lock-preview', 'upsert-order']);
  const expectedExpiry = new Date();
  expectedExpiry.setMonth(expectedExpiry.getMonth() + 6);
  assert.ok(Math.abs(invitation.expiryDate.getTime() - expectedExpiry.getTime()) < 1000);
});

test('repeated unlocks return the same invitation URL', async () => {
  const first = await request();
  const second = await request();
  assert.equal(second.body.slug, first.body.slug);
  assert.equal(second.statusCode, 200);
});

test('concurrent unlocks return one invitation URL', async () => {
  const responses = await Promise.all([request(), request(), request()]);
  assert.ok(responses.every(response => response.statusCode === 200));
  assert.equal(new Set(responses.map(response => response.body.slug)).size, 1);
});

test('reuses an existing pending order without charging its template price', async () => {
  order = { id: 'order-1', amount: 89900, paymentStatus: 'PENDING', gatewayRef: 'order_mock_old' };
  const response = await request();
  assert.equal(response.statusCode, 200);
  assert.equal(invitation.orderId, order.id);
  assert.equal(order.amount, 0);
  assert.equal(order.gatewayRef, null);
});

test('rejects another user and unknown previews without writing records', async () => {
  assert.equal((await request('other-user')).statusCode, 404);
  assert.deepEqual(transactionEvents, []);
  preview = null;
  assert.equal((await request()).statusCode, 404);
  assert.equal(order, null);
  assert.equal(invitation, null);
});

test('rejects missing authentication', async () => {
  assert.equal((await request(null)).statusCode, 401);
  assert.deepEqual(transactionEvents, []);
});

test('preserves premium and deluxe hosting durations', async () => {
  preview.template.tier = 'PREMIUM';
  await request();
  const expectedExpiry = new Date();
  expectedExpiry.setMonth(expectedExpiry.getMonth() + 12);
  assert.ok(Math.abs(invitation.expiryDate.getTime() - expectedExpiry.getTime()) < 1000);
  invitation = null;
  order = null;
  preview.template.tier = 'DELUXE';
  await request();
  assert.equal(invitation.expiryDate, null);
});

test('cache failure does not hide a successfully saved invitation', async () => {
  cacheError = new Error('Redis unavailable');
  const response = await request();
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.slug, invitation.slug);
});

test('database failure returns an error rather than an unsaved URL', async () => {
  databaseError = new Error('PostgreSQL unavailable');
  const response = await request();
  assert.equal(response.statusCode, 500);
  assert.equal(response.body.status, 'error');
  assert.equal(response.body.slug, undefined);
  assert.equal(invitation, null);
});
