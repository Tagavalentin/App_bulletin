import { Router } from 'express';
import {
  createEleve,
  getEleves,
  getEleve,
  updateEleve,
  deleteEleve
} from '../controllers/eleveController';

const router = Router();

router.post('/', createEleve);
router.get('/', getEleves);
router.get('/:id', getEleve);
router.put('/:id', updateEleve);
router.delete('/:id', deleteEleve);

export default router;
