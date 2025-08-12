import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// Gestión de horarios médicos (sp_GestionHorariosMedicos)
router.post('/horarios', async (req, res) => {
  const { operacion, idHorario, idMedico, diaSemana, horaInicio, horaFin, estado } = req.body;
  try {
    const [rows] = await pool.query(
      'CALL sp_GestionHorariosMedicos(:operacion, :idHorario, :idMedico, :diaSemana, :horaInicio, :horaFin, :estado)',
      { operacion, idHorario, idMedico, diaSemana, horaInicio, horaFin, estado }
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al gestionar horarios médicos', details: error.message });
  }
});

export default router;
