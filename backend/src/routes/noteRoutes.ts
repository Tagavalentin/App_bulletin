import { Router } from 'express';
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  createNotesBulk
} from '../controllers/noteController';

const router = Router();

router.post('/', createNote);
router.post('/bulk', createNotesBulk);
router.get('/', getNotes);
router.get('/:id', getNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
