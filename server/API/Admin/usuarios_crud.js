import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// CRUD de usuarios (sp_GestionUsuarios)
router.post('/usuarios', async (req, res) => {
  const { operacion, idUsuario, nombreUsuario, contra, rol, nombre, apellido, matricula, carrera, fechaNacimiento, correo, telefono, especialidad } = req.body;
  try {
    const [rows] = await pool.query(
      'CALL sp_GestionUsuarios(:operacion, :idUsuario, :nombreUsuario, :contra, :rol, :nombre, :apellido, :matricula, :carrera, :fechaNacimiento, :correo, :telefono, :especialidad)',
      { operacion, idUsuario, nombreUsuario, contra, rol, nombre, apellido, matricula, carrera, fechaNacimiento, correo, telefono, especialidad }
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al gestionar usuarios', details: error.message });
  }
});

export default router;
