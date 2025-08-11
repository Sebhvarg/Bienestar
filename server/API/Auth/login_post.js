import express from 'express';
import { pool } from '../../db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
      const { username, password, role } = req.body || {};
      if (!username || !password || !role) {
        return res.status(400).json({ message: 'username, password y rol son requeridos' });
      }
  
      // Map client roles to DB roles
      const roleMap = { admin: 'Administrador', doctor: 'Medico', student: 'Estudiante' };
      const dbRole = roleMap[role] || null;
      if (!dbRole) {
        return res.status(400).json({ message: 'Rol inválido' });
      }
  
  const [users] = await pool.query(
        'SELECT ID_USUARIO, NOMBRE_USUARIO, ROL, ESTADO, CONTRA, ULTIMO_LOGIN, INTENTOS_FALLIDOS FROM USUARIO WHERE NOMBRE_USUARIO = :username AND ROL = :rol LIMIT 1',
        { username, rol: dbRole }
      );
  
      if (!Array.isArray(users) || users.length === 0) {
        
        return res.status(401).json({ message: 'Usuario inválido' });

      }
  
      const user = users[0];
  
      // For demo: plain text password match (SQL seed has plain text). In production, use hashed passwords
      if (String(user.CONTRA) !== String(password)) {
        await pool.query(
          'UPDATE USUARIO SET INTENTOS_FALLIDOS = INTENTOS_FALLIDOS + 1 WHERE NOMBRE_USUARIO = :username',
          { username }
        );
        const failedAttempts = Number(user.INTENTOS_FALLIDOS || 0) + 1;
        return res.status(401).json({ message: 'Contraseña incorrecta', failedAttempts });
      }
  
      // Update last login and reset failed attempts
      await pool.query(
        'UPDATE USUARIO SET ULTIMO_LOGIN = NOW(), INTENTOS_FALLIDOS = 0 WHERE ID_USUARIO = :id',
        { id: user.ID_USUARIO }
      );
  
      const clientRoleMap = { Administrador: 'admin', Medico: 'doctor', Estudiante: 'student' };
      const clientUser = {
        id: String(user.ID_USUARIO),
        email: user.NOMBRE_USUARIO, // Frontend expects `email`; we reuse username
        name: user.NOMBRE_USUARIO,
        role: clientRoleMap[user.ROL] || 'student',
        createdAt: new Date().toISOString(),
      };
  
      res.json({ user: clientUser, failedAttempts: 0 });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

export default router;
