// routes/usuarios_crud.js
import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

function normalize(val) {
  return val === undefined ? null : val;
}

// CREAR usuario
router.post('/', async (req, res) => {
  const {
    idUsuario,
    nombreUsuario,
    contra,
    rol, // 'Administrador', 'Medico' o 'Estudiante'
    nombre,
    apellido,
    matricula,
    carrera,
    fechaNacimiento,
    correo,
    telefono,
    especialidad,
    estado,
    promedioAcademico
  } = req.body;

  try {
    console.log('POST - Datos recibidos:', req.body);
    
    const [rows] = await pool.query(
      'CALL sp_GestionUsuarios(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
        normalize(especialidad)
      ]
    );
    
    console.log('POST - Resultado:', rows);
    res.json({ data: rows, message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error en POST:', error);
    res.status(500).json({ error: 'Error al crear usuario', details: error.message });
  }
});

// LEER usuarios por rol
router.get('/', async (req, res) => {
  const { rol } = req.query;
  try {
    console.log('GET - Rol solicitado:', rol);
    
    const [rows] = await pool.query(
      'CALL sp_GestionUsuarios(?, NULL, NULL, NULL, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)',
      ['R', normalize(rol)]
    );
    
    console.log('GET - Resultado:', rows);
    res.json({ data: rows[0] || [] });
  } catch (error) {
    console.error('Error en GET:', error);
    res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
  }
});

// ACTUALIZAR usuario
router.put('/', async (req, res) => {
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
    estado,
    promedioAcademico
  } = req.body;

  try {
    console.log('PUT - Datos recibidos:', req.body);
    
    if (!idUsuario) {
      return res.status(400).json({ error: 'ID de usuario requerido para actualización' });
    }

    const [rows] = await pool.query(
      'CALL sp_GestionUsuarios(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'U', 
        normalize(idUsuario),
        normalize(nombreUsuario),
        normalize(contra), // Si es null/undefined, no se actualiza la contraseña
        normalize(rol),
        normalize(nombre),
        normalize(apellido),
        normalize(matricula),
        normalize(carrera),
        normalize(fechaNacimiento),
        normalize(correo),
        normalize(telefono),
        normalize(especialidad)
      ]
    );
    
    console.log('PUT - Resultado:', rows);
    res.json({ data: rows, message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error en PUT:', error);
    res.status(500).json({ error: 'Error al actualizar usuario', details: error.message });
  }
});

// ELIMINAR usuario - con parámetro de URL
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    console.log('DELETE - ID recibido:', id);
    
    await pool.query(
      'CALL sp_GestionUsuarios(?, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)',
      ['D', id]
    );
    
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error en DELETE:', error);
    res.status(500).json({ error: 'Error al eliminar usuario', details: error.message });
  }
});

// ELIMINAR usuario - versión alternativa que acepta ID en el body (opcional)
router.delete('/', async (req, res) => {
  const { idUsuario } = req.body;
  try {
    console.log('DELETE (body) - ID recibido:', idUsuario);
    
    await pool.query(
      'CALL sp_GestionUsuarios(?, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)',
      ['D', idUsuario]
    );
    
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error en DELETE (body):', error);
    res.status(500).json({ error: 'Error al eliminar usuario', details: error.message });
  }
});

export default router;