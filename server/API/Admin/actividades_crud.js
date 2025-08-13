import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

// CRUD de actividades usando el stored procedure sp_GestionActividades
router.post('/', async (req, res) => {
  // Destructuring con los nombres que vienen del frontend
  const { 
    operacion, 
    ID_ACTIVIDAD, 
    idActividad, 
    NOMBRE_ACTIVIDAD, 
    nombre, 
    DESCRIPCION, 
    descripcion, 
    FECHA_HORA, 
    fechaHora, 
    CUPO_MAXIMO, 
    cupoMaximo, 
    UBICACION, 
    ubicacion, 
    TIPO_ACTIVIDAD, 
    tipo, 
    ID_ADMINISTRADOR, 
    idAdmin 
  } = req.body;

  // Usar los valores correctos con fallbacks
  const actividadId = ID_ACTIVIDAD || idActividad;
  const actividadNombre = NOMBRE_ACTIVIDAD || nombre;
  const actividadDescripcion = DESCRIPCION || descripcion;
  const actividadFechaHora = FECHA_HORA || fechaHora;
  const actividadCupoMaximo = CUPO_MAXIMO || cupoMaximo;
  const actividadUbicacion = UBICACION || ubicacion;
  const actividadTipo = TIPO_ACTIVIDAD || tipo;
  const adminId = ID_ADMINISTRADOR || idAdmin;
  
  try {
    // Log para debugging
    console.log('Datos recibidos:', req.body);
    console.log('Operación:', operacion);
    console.log('ID Actividad:', actividadId);
    console.log('Nombre:', actividadNombre);

    // Validación básica de operación
    if (!operacion || !['C', 'R', 'U', 'D'].includes(operacion)) {
      return res.status(400).json({ 
        error: 'Operación inválida. Debe ser C (crear), R (leer), U (actualizar) o D (eliminar)' 
      });
    }

    // Validaciones específicas por operación
    if (operacion === 'C' || operacion === 'U') {
      if (!actividadNombre || !actividadNombre.trim()) {
        return res.status(400).json({ error: 'El nombre es requerido' });
      }
      if (!actividadFechaHora) {
        return res.status(400).json({ error: 'La fecha y hora son requeridas' });
      }
      if (!actividadCupoMaximo || actividadCupoMaximo < 1) {
        return res.status(400).json({ error: 'El cupo máximo debe ser mayor a 0' });
      }
      if (!actividadUbicacion || !actividadUbicacion.trim()) {
        return res.status(400).json({ error: 'La ubicación es requerida' });
      }
      if (!actividadTipo || !actividadTipo.trim()) {
        return res.status(400).json({ error: 'El tipo de actividad es requerido' });
      }
    }

    if (operacion === 'U' || operacion === 'D') {
      if (!actividadId) {
        return res.status(400).json({ error: 'El ID de la actividad es requerido para esta operación' });
      }
    }

    // Llamada al stored procedure
    const [rows] = await pool.query(
      'CALL sp_GestionActividades(?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        operacion,
        actividadId || null,
        actividadNombre || null,
        actividadDescripcion || null,
        actividadFechaHora || null,
        actividadCupoMaximo || null,
        actividadUbicacion || null,
        actividadTipo || null,
        adminId || null
      ]
    );

    // Manejo de respuesta según la operación
    let response = { success: true };

    switch (operacion) {
      case 'C':
        response.message = 'Actividad creada exitosamente';
        break;
      case 'R':
        response.message = 'Actividades obtenidas exitosamente';
        break;
      case 'U':
        response.message = 'Actividad actualizada exitosamente';
        break;
      case 'D':
        response.message = 'Actividad eliminada exitosamente';
        break;
    }

    response.data = rows;
    res.json(response);

  } catch (error) {
    console.error('Error en gestión de actividades:', error);
    
    // Manejo de errores específicos
    let errorMessage = 'Error interno del servidor';
    
    if (error.code === 'ER_SP_DOES_NOT_EXIST') {
      errorMessage = 'El procedimiento almacenado no existe';
    } else if (error.code === 'ER_DUP_ENTRY') {
      errorMessage = 'Ya existe una actividad con ese nombre';
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      errorMessage = 'El administrador especificado no existe';
    } else if (error.sqlMessage) {
      errorMessage = error.sqlMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Endpoint adicional para obtener una actividad específica (opcional)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID de actividad inválido' });
    }

    const [rows] = await pool.query(
      'CALL sp_GestionActividades(?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['R', parseInt(id), null, null, null, null, null, null, null]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    res.json({ success: true, data: rows });

  } catch (error) {
    console.error('Error al obtener actividad:', error);
    res.status(500).json({ 
      error: 'Error al obtener la actividad', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;