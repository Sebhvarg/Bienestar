import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// Vista vw_HistorialMedico
router.get('/historial-medico', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vw_HistorialMedico');
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial médico', details: error.message });
  }
});

export default router;
