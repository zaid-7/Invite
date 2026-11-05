const assert = require('node:assert/strict');
const { test } = require('node:test');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env.ts');
const { authMiddleware } = require('./auth.ts');
const { generateToken } = require('../utils/token.ts');

function authenticate(token) {
  const req = { headers: token ? { authorization: `Bearer ${token}` } : {} };
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
    },
  };
  let continued = false;
  authMiddleware(req, res, () => { continued = true; });
  return { req, res, continued };
}

test('missing login returns a recoverable authentication code', () => {
  const { res, continued } = authenticate();
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.code, 'AUTH_REQUIRED');
  assert.equal(continued, false);
});

test('tokens signed before a key change return INVALID_TOKEN', () => {
  const oldToken = jwt.sign({ userId: 'owner-1' }, 'previous-local-test-key');
  const { res, continued } = authenticate(oldToken);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.code, 'INVALID_TOKEN');
  assert.equal(continued, false);
});

test('expired tokens return INVALID_TOKEN', () => {
  const expiredToken = jwt.sign({ userId: 'owner-1' }, env.JWT_SECRET, { expiresIn: -1 });
  const { res } = authenticate(expiredToken);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.code, 'INVALID_TOKEN');
});

test('a fresh login continues with the authenticated user', () => {
  const { req, continued } = authenticate(generateToken({ userId: 'owner-1' }));
  assert.equal(continued, true);
  assert.equal(req.user.userId, 'owner-1');
});
