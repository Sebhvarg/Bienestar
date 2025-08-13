import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { idEstudiante, idActividad } = req.body;

  if (!idEstudiante || !idActividad) {
    return res.status(400).json({ error: 'idEstudiante y idActividad son requeridos' });
  }

  try {
    const [rows] = await pool.query(
      'CALL sp_InscripcionActividad(?, ?)',
      [idEstudiante, idActividad]
    );

    const resultado = rows[0][0]; // acceso al primer registro del primer conjunto
    res.json({ data: resultado });
  } catch (error) {
    res.status(500).json({
      error: error.sqlMessage || 'Error al inscribir en actividad',
      details: error.message
    });
  }
});

export default router;
