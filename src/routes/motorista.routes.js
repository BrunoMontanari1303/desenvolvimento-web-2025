import express from 'express';
import {
  listMotoristas,
  getMotorista,
  createMotoristaController,
  updateMotoristaController,
  deleteMotoristaController,
} from '../controllers/motoristaController.js';

const router = express.Router();

// Listar todos os motoristas
router.get('/', listMotoristas);

// Obter motorista por ID
router.get('/:id', getMotorista);

// Criar um novo motorista
router.post('/', createMotoristaController);

// Atualizar motorista
router.patch('/:id', updateMotoristaController);

// Deletar motorista
router.delete('/:id', deleteMotoristaController);

export default router;
