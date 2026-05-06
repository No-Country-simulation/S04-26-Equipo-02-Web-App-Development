import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Configuración de rate limiting(a definir ms y max según se convenga)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5000,
    message: {
        status: 429,
        error: 'Demasiadas peticiones. Por favor, intenta de nuevo en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// Configuración de cookie parser
app.use(cookieParser());

// middleware
app.use(cors()); // clave del front
app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.get('/hello', (_req: Request, res: Response) => {
  res.send('todo ok');
});

app.get('/hello-two', (_req: Request, res: Response) => {
  res.send('todo ok dos');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});