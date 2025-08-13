import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// Stats para el dashboard
router.get('/stats', async (req, res) => {
  try {
    // Cantidad de estudiantes activos
    const [estudiantes] = await pool.query(
      'SELECT COUNT(*) AS total FROM ESTUDIANTE WHERE ESTADO = 1'
    );

    // Cantidad de actividades activas
    const [actividades] = await pool.query(
      'SELECT COUNT(*) AS total FROM ACTIVIDAD WHERE ESTADO = 1'
    );

    res.json({
      stats: [
        {
          id: 1,
          title: 'Estudiantes Registrados',
          value: estudiantes[0].total,
          change: '+12%', // opcional, puedes calcularlo dinámicamente
          icon: 'Users',
          color: 'bg-blue-500',
        },
        {
          id: 2,
          title: 'Actividades Activas',
          value: actividades[0].total,
          change: '+3%', // opcional
          icon: 'Calendar',
          color: 'bg-green-500',
        },
      ],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
