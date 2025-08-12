import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// Vista vw_CitasMedicas
router.get('/citas-medicas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vw_CitasMedicas');
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener citas médicas', details: error.message });
  }
});

export default router;
