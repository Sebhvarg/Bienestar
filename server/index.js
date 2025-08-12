import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';

// Auth
import loginRouter from './API/Auth/login_post.js';
import datos from './API/Auth/datos_get.js';

// Admin
import estudiantesCrud from './API/Admin/estudiantes_crud.js';
import actividadesCrud from './API/Admin/actividades_crud.js';
import usuariosCrud from './API/Admin/usuarios_crud.js';
import asistenciaCrud from './API/Admin/asistencia_crud.js';
import becasCrud from './API/Admin/becas_crud.js';
import certificadosCrud from './API/Admin/certificados_crud.js';
import reporteParticipacion from './API/Admin/reporte_participacion.js';
import solicitudesPendientes from './API/Admin/solicitudes_pendientes.js';
import certificadosEmitidos from './API/Admin/certificados_emitidos.js';

// Doctor
import citasCrud from './API/Doctor/citas_crud.js';
import horariosCrud from './API/Doctor/horarios_crud.js';
import historialMedico from './API/Doctor/historial_medico.js';
import citasMedicas from './API/Doctor/citas_medicas.js';

// Estudiante
import inscripcionActividad from './API/Estudiante/inscripcion_actividad.js';
import reporteParticipacionEst from './API/Estudiante/reporte_participacion.js';
import resumenActividades from './API/Estudiante/resumen_actividades.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// pool es un singleton importado desde ./db.js

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as ok');
    res.json({ status: 'ok', db: rows[0] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Rutas

// Auth
app.use('/api/auth', loginRouter);
app.use('/api/auth', datos);

// Admin
app.use('/api/admin/estudiantes', estudiantesCrud);
app.use('/api/admin/actividades', actividadesCrud);
app.use('/api/admin/usuarios', usuariosCrud);
app.use('/api/admin/asistencia', asistenciaCrud);
app.use('/api/admin/becas', becasCrud);
app.use('/api/admin/certificados', certificadosCrud);
app.use('/api/admin/reporte-participacion', reporteParticipacion);
app.use('/api/admin/solicitudes-pendientes', solicitudesPendientes);
app.use('/api/admin/certificados-emitidos', certificadosEmitidos);

// Doctor
app.use('/api/doctor/citas', citasCrud);
app.use('/api/doctor/horarios', horariosCrud);
app.use('/api/doctor/historial-medico', historialMedico);
app.use('/api/doctor/citas-medicas', citasMedicas);

// Estudiante
app.use('/api/estudiante/inscripcion-actividad', inscripcionActividad);
app.use('/api/estudiante/reporte-participacion', reporteParticipacionEst);
app.use('/api/estudiante/resumen-actividades', resumenActividades);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});


