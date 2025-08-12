import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// CRUD de actividades (sp_GestionActividades)
router.post('/actividades', async (req, res) => {
  const { operacion, idActividad, nombre, descripcion, fechaHora, cupoMaximo, ubicacion, tipo, idAdmin } = req.body;
  try {
    const [rows] = await pool.query(
      'CALL sp_GestionActividades(:operacion, :idActividad, :nombre, :descripcion, :fechaHora, :cupoMaximo, :ubicacion, :tipo, :idAdmin)',
      { operacion, idActividad, nombre, descripcion, fechaHora, cupoMaximo, ubicacion, tipo, idAdmin }
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al gestionar actividades', details: error.message });
  }
});

export default router;
