import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

router.get('/datos', async (req, res) => {
  try {
    const { id } = req.query;
    const result = await pool.query('SELECT * FROM administrador WHERE id = $1', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

export default router;