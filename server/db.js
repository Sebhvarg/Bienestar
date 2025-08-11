import dotenv from 'dotenv';
import { createPool } from 'mysql2/promise';

dotenv.config();

// Módulo singleton: Node.js cachea el módulo, por lo que esta instancia
// se comparte en toda la app al hacer import { pool } from './db.js'
const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'BienestarEstudiantil',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

export { pool };


