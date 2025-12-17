import express from 'express';
import { body, validationResult } from 'express-validator'
import {
  getUsuarioByEmailController,
  listUsuarios,
  getUsuario,
  updateUsuarioController,
  deleteUsuarioController,
  
} from '../controllers/usuarioController.js';
import { registerController } from '../controllers/authController.js'

const router = express.Router();

// Listar todos os usuários
router.get('/', listUsuarios);

// Obter usuário por Email
router.get('/by-email', getUsuarioByEmailController);

// Obter usuário por ID
router.get('/:id', getUsuario);

// Criar um novo usuário
router.post('/', registerController);

// Atualizar um usuário
router.patch('/:id', updateUsuarioController);

// Deletar um usuário
router.delete('/:id', deleteUsuarioController);

export default router;