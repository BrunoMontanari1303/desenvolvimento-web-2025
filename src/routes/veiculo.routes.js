import express from 'express';
import {
  listVeiculos,
  getVeiculo,
  createVeiculoController,
  updateVeiculoController,
  deleteVeiculoController,
} from '../controllers/veiculoController.js';

const router = express.Router();

// Listar todos os veículos
router.get('/', listVeiculos);

// Obter veículo por ID
router.get('/:id', getVeiculo);

// Criar um novo veículo
router.post('/', createVeiculoController);

// Atualizar veículo
router.patch('/:id', updateVeiculoController);

// Deletar veículo
router.delete('/:id', deleteVeiculoController);

export default router;
