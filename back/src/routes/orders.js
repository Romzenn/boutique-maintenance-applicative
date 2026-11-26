const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../auth');

const router = express.Router();

const PROMO_CODES = { BIENVENUE10: 10 };
const SHIPPING = 4.9;

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, total, status, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { items, promoCode } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Panier vide' });
    }

    let subtotal = 0;
    const lines = [];
    for (const item of items) {
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [item.productId]);
      const product = result.rows[0];
      if (!product) {
        return res.status(400).json({ error: `Produit ${item.productId} introuvable` });
      }
      if (item.quantity >= product.stock) {
        return res.status(400).json({ error: `Stock insuffisant pour ${product.name}` });
      }
      await pool.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [
        item.quantity,
        product.id,
      ]);
      subtotal += parseFloat(product.price) * item.quantity;
      lines.push({ product, quantity: item.quantity });
    }

    let discount = 0;
    if (promoCode && PROMO_CODES[promoCode]) {
      discount = subtotal * PROMO_CODES[promoCode] / 100;
    }
    const total = subtotal - discount + SHIPPING;

    const order = await pool.query(
      'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id, total, status, created_at',
      [req.user.id, total]
    );
    for (const line of lines) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
        [order.rows[0].id, line.product.id, line.quantity, line.product.price]
      );
    }

    res.status(201).json(order.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/cancel', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query(
      "UPDATE orders SET status = 'annulee' WHERE id = $1 AND user_id = $2 AND status = 'confirmee' RETURNING id, total, status",
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Commande introuvable ou déjà annulée' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
