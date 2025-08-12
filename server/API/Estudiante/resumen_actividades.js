import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// Vista vw_ResumenActividadesEstudiante
router.get('/resumen-actividades', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vw_ResumenActividadesEstudiante');
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resumen de actividades', details: error.message });
  }
});

export default router;
