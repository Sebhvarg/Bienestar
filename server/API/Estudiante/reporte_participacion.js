import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// Reporte de participación del estudiante (sp_ReporteParticipacionEstudiante)
router.get('/reporte-participacion', async (req, res) => {
  const { idEstudiante } = req.query;
  try {
    const [rows] = await pool.query(
      'CALL sp_ReporteParticipacionEstudiante(:idEstudiante)',
      { idEstudiante }
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reporte de participación', details: error.message });
  }
});

export default router;
