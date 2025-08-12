import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// Solicitud de certificados (sp_SolicitudCertificado)
router.post('/certificados', async (req, res) => {
  const { idEstudiante, idActividad } = req.body;
  try {
    const [rows] = await pool.query(
      'CALL sp_SolicitudCertificado(:idEstudiante, :idActividad)',
      { idEstudiante, idActividad }
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al solicitar certificado', details: error.message });
  }
});

export default router;
