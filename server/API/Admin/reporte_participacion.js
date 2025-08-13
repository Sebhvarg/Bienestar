import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// Reporte de participación de un estudiante
router.get('/reporte-participacion/:idEstudiante', async (req, res) => {
  const idEstudiante = parseInt(req.params.idEstudiante, 10);
  if (isNaN(idEstudiante)) {
    return res.status(400).json({ error: 'ID de estudiante inválido' });
  }

  try {
    const [results] = await pool.query('CALL sp_ReporteParticipacionEstudiante(?)', [idEstudiante]);

    // El SP devuelve 2 result sets: resultados[0] y resultados[1]
    const resumen = results[0] || [];
    const detalle = results[1] || [];

    res.json({ resumen, detalle });
  } catch (error) {
    console.error('Error al obtener reporte de participación:', error);
    res.status(500).json({ error: 'Error al obtener reporte', details: error.message });
  }
});

export default router;
