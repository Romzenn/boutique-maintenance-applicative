// Tests d'intégration : l'API doit tourner (docker compose up) avant de lancer `npm test`.
const { test } = require('node:test');
const assert = require('node:assert');

const API = process.env.API_URL || 'http://localhost:3000/api';

async function call(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  return { status: res.status, body: await res.json() };
}

async function login() {
  const { body } = await call('/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'alice@boutique.test', password: 'alice123' }),
  });
  return body.token;
}

test('GET /health répond ok', async () => {
  const { status, body } = await call('/health');
  assert.strictEqual(status, 200);
  assert.strictEqual(body.status, 'ok');
});

test('POST /login refuse un mauvais mot de passe', async () => {
  const { status } = await call('/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'alice@boutique.test', password: 'faux' }),
  });
  assert.strictEqual(status, 401);
});

test('GET /products/:id renvoie 404 pour un produit inconnu', async () => {
  const { status } = await call('/products/9999');
  assert.strictEqual(status, 404);
});

test('POST /orders exige une connexion', async () => {
  const { status } = await call('/orders', {
    method: 'POST',
    body: JSON.stringify({ items: [{ productId: 1, quantity: 1 }] }),
  });
  assert.strictEqual(status, 401);
});

// À vous : un test par ticket corrigé (écrivez-le AVANT le correctif, il doit échouer).
