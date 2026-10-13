import { Router } from 'express';
import {
  generateBulletin,
  getBulletins
} from '../controllers/bulletinController';

const router = Router();

router.get('/', getBulletins);
router.get('/eleve/:eleve_id/trimestre/:trimestre', generateBulletin);

export default router;
