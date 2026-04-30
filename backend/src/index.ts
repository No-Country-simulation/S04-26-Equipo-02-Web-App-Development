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

app.get('/hello', (req:Request, res: Response) => {
  res.send('todo ok');
})


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
