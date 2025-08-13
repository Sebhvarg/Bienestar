import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// Obtener todas las solicitudes de becas
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_GestionSolicitudesBecas(:operacion, NULL, NULL, NULL, NULL, NULL, NULL, NULL)', {
      operacion: 'R', // Leer todas
    });

    // Extraer la primera fila del resultado de la consulta
    const solicitudes = (rows[0] || []).map(() => ({
      ID_SOLICITUD: s.ID_SOLICITUD_BECA,
      ID_ESTUDIANTE: s.ID_ESTUDIANTE,
      ESTUDIANTE: s.Estudiante,
      ID_BECA: s.ID_BECA,
      BECA: s.NOMBRE_BECA,
      JUSTIFICACION: s.JUSTIFICACION,
      ESTADO: s.Estado_Solicitud,
      ID_ADMIN: s.ID_ADMINISTRADOR || null,
      OBSERVACIONES: s.OBSERVACIONES || '',
    }));

    res.json({ data: solicitudes });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener solicitudes', details: error.message });
  }
});

// Crear nueva solicitud de beca
router.post('/', async (req, res) => {
  const { idEstudiante, idBeca, justificacion } = req.body;
  try {
    const [rows] = await pool.query(
      'CALL sp_GestionSolicitudesBecas(:operacion, NULL, :idEstudiante, :idBeca, :justificacion, NULL, NULL, NULL)',
      { operacion: 'C', idEstudiante, idBeca, justificacion }
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear solicitud', details: error.message });
  }
});

// Actualizar solicitud (estado y observaciones por administrador)
// Eliminar o aprobar solicitud (PUT)
router.put('/:id', async (req, res) => {
  const idSolicitud = parseInt(req.params.id);
  const { estado, idAdmin, observaciones } = req.body;
  try {
    const [rows] = await pool.query(
      'CALL sp_GestionSolicitudesBecas(:operacion, :idSolicitud, NULL, NULL, NULL, :estado, :idAdmin, :observaciones)',
      { operacion: 'U', idSolicitud, estado, idAdmin, observaciones }
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar solicitud', details: error.message });
  }
});

// Eliminar solicitud
router.delete('/:id', async (req, res) => {
  const idSolicitud = parseInt(req.params.id);
  try {
    const [rows] = await pool.query(
      'CALL sp_GestionSolicitudesBecas(:operacion, :idSolicitud, NULL, NULL, NULL, NULL, NULL, NULL)',
      { operacion: 'D', idSolicitud }
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar solicitud', details: error.message });
  }
});


export default router;
