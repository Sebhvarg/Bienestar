import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// Gestión de solicitudes de becas (sp_GestionSolicitudesBecas)
router.post('/becas', async (req, res) => {
  const { operacion, idSolicitud, idEstudiante, idBeca, justificacion, estado, idAdmin, observaciones } = req.body;
  try {
    const [rows] = await pool.query(
      'CALL sp_GestionSolicitudesBecas(:operacion, :idSolicitud, :idEstudiante, :idBeca, :justificacion, :estado, :idAdmin, :observaciones)',
      { operacion, idSolicitud, idEstudiante, idBeca, justificacion, estado, idAdmin, observaciones }
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al gestionar becas', details: error.message });
  }
});

export default router;
