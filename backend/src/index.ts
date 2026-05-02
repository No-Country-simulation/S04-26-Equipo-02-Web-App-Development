import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// middleware
app.use(cors()); // clave del front
app.use(express.json()); 

app.get('/hello', (_req: Request, res: Response) => {
  res.send('todo ok');
});

app.get('/hello-two', (_req: Request, res: Response) => {
  res.send('todo ok dos');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
