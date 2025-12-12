import express from 'express';
import {
  listMotoristas,
  getMotorista,
  createMotoristaController,
  updateMotoristaController,
  deleteMotoristaController,
} from '../controllers/motoristaController.js';
import { ensureAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', ensureAuth(), listMotoristas);
router.get('/:id', ensureAuth(), getMotorista);
router.post('/', ensureAuth(['GESTOR', 'ADMIN']), createMotoristaController);
router.patch('/:id', ensureAuth(['GESTOR', 'ADMIN']), updateMotoristaController);
router.delete('/:id', ensureAuth(['GESTOR', 'ADMIN']), deleteMotoristaController);

export default router;
