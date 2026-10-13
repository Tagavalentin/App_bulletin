import { Router } from 'express';
import {
  createClasse,
  getClasses,
  getClasse,
  updateClasse,
  deleteClasse
} from '../controllers/classeController';

const router = Router();

router.post('/', createClasse);
router.get('/', getClasses);
router.get('/:id', getClasse);
router.put('/:id', updateClasse);
router.delete('/:id', deleteClasse);

export default router;
