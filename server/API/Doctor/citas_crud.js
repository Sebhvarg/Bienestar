import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// Gestión de citas médicas (sp_GestionCitasMedicas)
router.post('/citas', async (req, res) => {
  const { operacion, idSolicitudServicio, idEstudiante, idServicio, idMedico, fechaPrestacion, diagnostico, observaciones } = req.body;
  try {
    const [rows] = await pool.query(
      'CALL sp_GestionCitasMedicas(:operacion, :idSolicitudServicio, :idEstudiante, :idServicio, :idMedico, :fechaPrestacion, :diagnostico, :observaciones)',
      { operacion, idSolicitudServicio, idEstudiante, idServicio, idMedico, fechaPrestacion, diagnostico, observaciones }
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al gestionar citas médicas', details: error.message });
  }
});

export default router;
