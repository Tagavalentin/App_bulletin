import { Router } from 'express';
import {
  exportBulletinPDF,
  exportClassePDF
} from '../controllers/pdfController';

const router = Router();

router.get('/eleve/:eleve_id/trimestre/:trimestre', exportBulletinPDF);
router.get('/classe/:classe_id/trimestre/:trimestre', exportClassePDF);

export default router;
