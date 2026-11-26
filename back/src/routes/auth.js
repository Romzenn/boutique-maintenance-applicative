const express = require('express');
const pool = require('../db');
const { signToken } = require('../auth');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      'SELECT id, email, name FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const user = result.rows[0];
    res.json({ token: signToken(user), name: user.name });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
