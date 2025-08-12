import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// Vista vw_ReporteParticipacion
router.get('/reporte-participacion', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vw_ReporteParticipacion');
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reporte de participación', details: error.message });
  }
});

export default router;
