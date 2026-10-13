import { Router } from 'express';
import {
  createEtablissement,
  getEtablissement,
  updateEtablissement
} from '../controllers/etablissementController';

const router = Router();

router.post('/', createEtablissement);
router.get('/', getEtablissement);
router.put('/', updateEtablissement);

export default router;
