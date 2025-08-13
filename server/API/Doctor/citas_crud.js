import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// Obtener citas de un estudiante
router.get('/:idEstudiante', async (req, res) => {
  const { idEstudiante } = req.params;
  try {
    const [rows] = await pool.query(
      'CALL sp_GestionCitasMedicas(:operacion, NULL, :idEstudiante, NULL, NULL, NULL, NULL, NULL)',
      { operacion: 'LEER', idEstudiante }
    );
    res.json({ data: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener citas', details: error.message });
  }
});

// Crear cita
router.post('/', async (req, res) => {
  const { idEstudiante, idServicio, idMedico, fechaPrestacion, diagnostico, observaciones } = req.body;
  try {
    const [rows] = await pool.query(
      'CALL sp_GestionCitasMedicas(:operacion, NULL, :idEstudiante, :idServicio, :idMedico, :fechaPrestacion, :diagnostico, :observaciones)',
      { operacion: 'CREAR', idEstudiante, idServicio, idMedico, fechaPrestacion, diagnostico, observaciones }
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cita', details: error.message });
  }
});

// Actualizar cita
router.put('/:idSolicitudServicio', async (req, res) => {
  const { idSolicitudServicio } = req.params;
  const { idEstudiante, idServicio, idMedico, fechaPrestacion, diagnostico, observaciones } = req.body;
  try {
    const [rows] = await pool.query(
      'CALL sp_GestionCitasMedicas(:operacion, :idSolicitudServicio, :idEstudiante, :idServicio, :idMedico, :fechaPrestacion, :diagnostico, :observaciones)',
      { operacion: 'ACTUALIZAR', idSolicitudServicio, idEstudiante, idServicio, idMedico, fechaPrestacion, diagnostico, observaciones }
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cita', details: error.message });
  }
});

// Eliminar cita
router.delete('/:idSolicitudServicio', async (req, res) => {
  const { idSolicitudServicio } = req.params;
  try {
    const [rows] = await pool.query(
      'CALL sp_GestionCitasMedicas(:operacion, :idSolicitudServicio, NULL, NULL, NULL, NULL, NULL, NULL)',
      { operacion: 'ELIMINAR', idSolicitudServicio }
    );
    res.json({ message: 'Cita eliminada correctamente', data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cita', details: error.message });
  }
});

export default router;
