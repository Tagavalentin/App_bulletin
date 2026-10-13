import { Router } from 'express';
import {
  createMatiere,
  getMatieres,
  getMatiere,
  updateMatiere,
  deleteMatiere
} from '../controllers/matiereController';

const router = Router();

router.post('/', createMatiere);
router.get('/', getMatieres);
router.get('/:id', getMatiere);
router.put('/:id', updateMatiere);
router.delete('/:id', deleteMatiere);

export default router;
