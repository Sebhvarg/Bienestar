import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();
let datos = [];
router.get('/datos', async (req, res) => {
  try {
    // El id puede venir por query (?userId=) o por req.user si hay auth
    const id = req.query.userId;
    if (!id) {
      return res.status(400).json({ error: 'UserId requerido' });
    }
    const rol = await pool.query('SELECT ROL FROM USUARIO WHERE ID_USUARIO = :id', { id });
    switch (rol[0][0].ROL) {
      case 'Administrador':
        datos = await pool.query('SELECT * FROM ADMINISTRADOR WHERE ID_USUARIO = :id', { id });
        return res.json({ data: datos[0][0] });
      case 'Medico':
        datos = await pool.query('SELECT * FROM MEDICO WHERE ID_USUARIO = :id', { id });
        return res.json({ data: datos[0][0] });
        break;
      case 'Estudiante':
        datos = await pool.query('SELECT * FROM ESTUDIANTE WHERE ID_USUARIO = :id', { id });
        return res.json({ data: datos[0][0]});
      default:

        return res.status(403).json({ error: 'Acceso denegado' });
    }
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

export default router;