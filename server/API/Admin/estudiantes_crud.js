import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// 📌 Crear estudiante (usando sp_GestionUsuarios)
router.post('/', async (req, res) => {
  try {
    const {
      nombre_usuario,
      contra,
      nombre,
      apellido,
      numero_matricula,
      carrera,
      fecha_nacimiento,
      correo_electronico,
      telefono,
      promedio_academico,
      estado
    } = req.body;

    const sql = `CALL sp_GestionUsuarios(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      'C',
      null,
      nombre_usuario ?? numero_matricula, // p_NOMBRE_USUARIO (usa matrícula si no se provee)
      contra ?? numero_matricula,         // p_CONTRA (usa matrícula si no se provee)
      'Estudiante',
      nombre ?? null,
      apellido ?? null,
      numero_matricula ?? null,
      carrera ?? null,
      fecha_nacimiento ?? null,
      correo_electronico ?? null,
      telefono ?? null,
      null // p_ESPECIALIDAD solo para médicos
    ];

    const [result] = await pool.query(sql, params);
    res.status(201).json({ message: 'Estudiante creado correctamente', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Obtener todos o uno (usando sp_GestionUsuarios)
router.get('/:id?', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `CALL sp_GestionUsuarios(?, ?, NULL, NULL, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`,
      ['R', id || null, 'Estudiante']
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Actualizar estudiante (usando sp_GestionUsuarios)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre_usuario,
      contra,
      nombre,
      apellido,
      numero_matricula,
      carrera,
      fecha_nacimiento,
      correo_electronico,
      telefono,
      promedio_academico,
      estado
    } = req.body;

    const sql = `CALL sp_GestionUsuarios(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      'U',
      Number(id),
      nombre_usuario ?? numero_matricula,
      contra ?? numero_matricula,
      'Estudiante',
      nombre ?? null,
      apellido ?? null,
      numero_matricula ?? null,
      carrera ?? null,
      fecha_nacimiento ?? null,
      correo_electronico ?? null,
      telefono ?? null,
      null // p_ESPECIALIDAD
    ];

    const [rows] = await pool.query(sql, params);
    res.json({ message: 'Estudiante actualizado correctamente', rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Eliminar estudiante (usando sp_GestionUsuarios)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      `CALL sp_GestionUsuarios(?, ?, NULL, NULL, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`,
      ['D', Number(id), 'Estudiante']
    );
    res.json({ message: 'Estudiante eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
