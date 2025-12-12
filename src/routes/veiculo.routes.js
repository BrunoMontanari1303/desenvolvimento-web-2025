import express from 'express';
import {
  listVeiculos,
  getVeiculo,
  createVeiculoController,
  updateVeiculoController,
  deleteVeiculoController,
} from '../controllers/veiculoController.js';
import { ensureAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Listar todos os veículos
router.get('/', ensureAuth(), listVeiculos);

// Obter veículo por ID
router.get('/:id', ensureAuth(), getVeiculo);

// Criar um novo veículo
router.post('/', ensureAuth(['GESTOR', 'ADMIN']), createVeiculoController);

// Atualizar veículo
router.patch('/:id', ensureAuth(['GESTOR', 'ADMIN']), updateVeiculoController);

// Deletar veículo
router.delete('/:id', ensureAuth(['GESTOR', 'ADMIN']), deleteVeiculoController);

export default router;
