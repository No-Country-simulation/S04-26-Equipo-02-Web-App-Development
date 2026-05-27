import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.routes';
import profileRoutes from './modules/profiles/profiles.routes';
import diagnosticRoutes from './modules/diagnostic/diagnostic.routes';
import hiringRoutes from './modules/hiring/hiring.routes';
import learningRoutes from './modules/learning/learning.routes';

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
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/diagnostic', diagnosticRoutes);
app.use('/api/v1/hiring', hiringRoutes);
app.use('/api/v1/learning', learningRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});