import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// Vista vw_CertificadosEmitidos
router.get('/certificados-emitidos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vw_CertificadosEmitidos');
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener certificados emitidos', details: error.message });
  }
});

export default router;
