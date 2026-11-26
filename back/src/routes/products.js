const express = require('express');
const pool = require('../db');

const router = express.Router();
const PAGE_SIZE = 8;

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';

    const params = [];
    let where = '';
    if (search) {
      params.push(`%${search}%`);
      where = `WHERE name LIKE $${params.length}`;
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM products ${where}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const offset = page * PAGE_SIZE;
    params.push(PAGE_SIZE, offset);
    const result = await pool.query(
      `SELECT * FROM products ${where} ORDER BY id LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({
      products: result.rows,
      page,
      totalPages: Math.ceil(total / PAGE_SIZE),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
