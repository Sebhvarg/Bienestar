import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// Reporte de participación de un estudiante
router.get('/:idEstudiante', async (req, res) => {
  const idEstudiante = parseInt(req.params.idEstudiante);
  if (isNaN(idEstudiante)) {
    return res.status(400).json({ error: 'ID de estudiante inválido' });
  }

  try {
    // Llamada al SP
    const [resultSets] = await pool.query('CALL sp_ReporteParticipacionEstudiante(?)', [idEstudiante]);

    // resultSets es un array donde:
    // resultSets[0] -> primer SELECT (resumen)
    // resultSets[1] -> segundo SELECT (detalle)
    const resumen = resultSets[0]?.[0] || null;
    const detalle = resultSets[1] || [];

    res.json({ resumen, detalle });
  } catch (error) {
    console.error('Error al obtener reporte de participación:', error);
    res.status(500).json({ error: 'Error al obtener reporte de participación', details: error.message });
  }
});

export default router;
