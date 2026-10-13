import express, { Request, Response } from 'express';
import cors from 'cors';
import { initDatabase } from './database';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialiser la base de données
initDatabase();

// Routes de base
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API Bulletins Scolaires Togo' });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
