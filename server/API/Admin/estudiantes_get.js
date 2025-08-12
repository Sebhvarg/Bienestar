import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();
let datos = [];

router.get('/estudiantes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM ESTUDIANTE');
    datos = rows;
    res.json({ data: datos });
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({ error: 'Error al obtener estudiantes' });
  }
});

export default router;
