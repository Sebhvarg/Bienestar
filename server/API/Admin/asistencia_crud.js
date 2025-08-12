import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// Registrar asistencia (sp_RegistrarAsistencia)
router.post('/asistencia', async (req, res) => {
  const { idInscripcion, idAdmin, observaciones } = req.body;
  try {
    const [rows] = await pool.query(
      'CALL sp_RegistrarAsistencia(:idInscripcion, :idAdmin, :observaciones)',
      { idInscripcion, idAdmin, observaciones }
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar asistencia', details: error.message });
  }
});

export default router;
