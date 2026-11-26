const express = require('express');
const pool = require('../db');

const router = express.Router();

const PROMO_CODES = { BIENVENUE10: 10 };
const SHIPPING = 4.9;

// Calcule le détail du panier : sous-total, remise, livraison, total
router.post('/total', async (req, res, next) => {
  try {
    const { items, promoCode } = req.body;

    let subtotal = 0;
    for (const item of items) {
      const result = await pool.query('SELECT price FROM products WHERE id = $1', [item.productId]);
      if (result.rows.length === 0) {
        return res.status(400).json({ error: `Produit ${item.productId} introuvable` });
      }
      subtotal += parseFloat(result.rows[0].price) * item.quantity;
    }

    let discount = 0;
    if (promoCode && PROMO_CODES[promoCode]) {
      discount = subtotal * PROMO_CODES[promoCode] / 100;
    }

    const total = subtotal - discount + SHIPPING;
    res.json({ subtotal, discount, shipping: SHIPPING, total });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
