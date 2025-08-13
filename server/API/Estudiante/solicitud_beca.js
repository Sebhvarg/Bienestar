import express from 'express';
import { pool } from '../../db.js'; // Ajusta según tu configuración de conexión

const router = express.Router();

// Crear / Leer / Actualizar solicitudes de beca
router.post('/', async (req, res) => {
  const {
    operacion,           // 'C', 'R', 'U'
    ID_SOLICITUD,        // opcional
    ID_ESTUDIANTE,       // necesario para 'C'
    ID_BECA,             // necesario para 'C'
    JUSTIFICACION,       // opcional
    ESTADO,              // necesario para 'U'
    ID_ADMINISTRADOR,    // necesario para 'U'
    OBSERVACIONES        // opcional
  } = req.body;

  try {
    const [result] = await pool.query(
      `CALL sp_GestionSolicitudesBecas(?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        operacion,
        ID_SOLICITUD || null,
        ID_ESTUDIANTE || null,
        ID_BECA || null,
        JUSTIFICACION || null,
        ESTADO || null,
        ID_ADMINISTRADOR || null,
        OBSERVACIONES || null
      ]
    );

    // Dependiendo de la operación, MySQL devuelve distintos resultados
    res.json({ success: true, data: result[0] || result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
