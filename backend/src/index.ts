import express, { Request, Response } from 'express';
import cors from 'cors';
import { initDatabase } from './database';
import { seedDatabase } from './database/seed';
import etablissementRoutes from './routes/etablissementRoutes';
import classeRoutes from './routes/classeRoutes';
import matiereRoutes from './routes/matiereRoutes';
import eleveRoutes from './routes/eleveRoutes';
import noteRoutes from './routes/noteRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialiser la base de données
initDatabase();

// Seed la base de données avec des données de test
seedDatabase();

// Routes de base
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API Bulletins Scolaires Togo' });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes API
app.use('/api/etablissement', etablissementRoutes);
app.use('/api/classes', classeRoutes);
app.use('/api/matieres', matiereRoutes);
app.use('/api/eleves', eleveRoutes);
app.use('/api/notes', noteRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
