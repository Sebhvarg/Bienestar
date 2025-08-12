import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// Vista vw_SolicitudesPendientes
router.get('/solicitudes-pendientes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vw_SolicitudesPendientes');
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener solicitudes pendientes', details: error.message });
  }
});

export default router;
