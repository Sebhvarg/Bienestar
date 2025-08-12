import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// Inscripción en actividades (sp_InscripcionActividad)
router.post('/inscripcion-actividad', async (req, res) => {
  const { idEstudiante, idActividad } = req.body;
  try {
    const [rows] = await pool.query(
      'CALL sp_InscripcionActividad(:idEstudiante, :idActividad)',
      { idEstudiante, idActividad }
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al inscribir en actividad', details: error.message });
  }
});

export default router;
