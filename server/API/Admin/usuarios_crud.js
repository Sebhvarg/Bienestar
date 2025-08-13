// routes/usuarios_crud.js
import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

function normalize(val) {
  return val === undefined || val === '' ? null : val;
}

// CREAR usuario
router.post('/', async (req, res) => {
  const {
    idUsuario,
    nombreUsuario,
    contra,
    rol,
    nombre,
    apellido,
    matricula,
    carrera,
    fechaNacimiento,
    correo,
    telefono,
    especialidad,
    promedioAcademico,
    estado
  } = req.body;

  try {
    console.log('POST - Datos recibidos:', req.body);
    const [rows] = await pool.query(
      'CALL sp_GestionUsuarios(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'C',
        normalize(idUsuario),
        normalize(nombreUsuario),
        normalize(contra),
        normalize(rol),
        normalize(nombre),
        normalize(apellido),
        normalize(matricula),
        normalize(carrera),
        normalize(fechaNacimiento),
        normalize(correo),
        normalize(telefono),
        normalize(especialidad),
        normalize(promedioAcademico),
        normalize(estado)
      ]
    );
    res.json({ message: 'Usuario creado exitosamente', data: rows });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: error.message });
  }
});

// ACTUALIZAR usuario
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    nombreUsuario,
    contra,
    rol,
    nombre,
    apellido,
    matricula,
    carrera,
    fechaNacimiento,
    correo,
    telefono,
    especialidad,
    promedioAcademico,
    estado
  } = req.body;

  try {
    console.log('PUT - Datos recibidos (ID, Body):', id, req.body);
    const [rows] = await pool.query(
      'CALL sp_GestionUsuarios(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'U',
        normalize(id),
        normalize(nombreUsuario),
        normalize(contra),
        normalize(rol),
        normalize(nombre),
        normalize(apellido),
        normalize(matricula),
        normalize(carrera),
        normalize(fechaNacimiento),
        normalize(correo),
        normalize(telefono),
        normalize(especialidad),
        normalize(promedioAcademico),
        normalize(estado)
      ]
    );
    res.json({ message: 'Usuario actualizado exitosamente', data: rows });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: error.message });
  }
});

// OBTENER usuarios
router.get('/', async (req, res) => {
  const {
    idUsuario,
    nombreUsuario,
    rol,
    nombre,
    apellido,
    matricula,
    carrera,
    fechaNacimiento,
    correo,
    telefono,
    especialidad
  } = req.query;

  try {
    console.log('GET / - Parámetros recibidos:', req.query);
    const [rows] = await pool.query(
      'CALL sp_GestionUsuarios(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'R',
        normalize(idUsuario),
        normalize(nombreUsuario),
        null,
        normalize(rol),
        normalize(nombre),
        normalize(apellido),
        normalize(matricula),
        normalize(carrera),
        normalize(fechaNacimiento),
        normalize(correo),
        normalize(telefono),
        normalize(especialidad),
        null,
        null
      ]
    );

    res.json({ message: 'Usuarios obtenidos exitosamente', data: rows[0] || [] });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: error.message });
  }
});

// OBTENER usuario por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    console.log('GET /:id - ID recibido:', id);
    const [rows] = await pool.query(
      'CALL sp_GestionUsuarios(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'R',
        normalize(id),
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ]
    );
    if (!rows[0] || rows[0].length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario obtenido exitosamente', data: rows[0][0] });
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    res.status(500).json({ error: error.message });
  }
});

// ELIMINAR usuario
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    console.log('DELETE - ID recibido:', id);
    await pool.query(
      'CALL sp_GestionUsuarios(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'D',
        normalize(id),
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ]
    );
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
