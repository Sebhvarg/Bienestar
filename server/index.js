import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';
import loginRouter from './API/Auth/login_post.js';

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
app.use('/api/auth', loginRouter);


app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});


