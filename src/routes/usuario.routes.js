import express from 'express';
import { body, validationResult } from 'express-validator'
import {
  getUsuarioByEmailController,
  listUsuarios,
  getUsuario,
  createUsuarioController,
  updateUsuarioController,
  deleteUsuarioController,
  
} from '../controllers/usuarioController.js';

const router = express.Router();

const createUsuarioValidator = [
  body('nome').isString().isLength({ min: 2 }).withMessage('nome é obrigatório'),
  body('email').isEmail().withMessage('email inválido'),
  body('senha').isString().isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
  body('papel').optional().isIn(['ADMIN','GESTOR','USER','1','2','3']).withMessage('papel inválido'),
  (req,res,next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 'error', message: 'Erro de validação', errors: errors.array() })
    }
    next()
  }
]

// Listar todos os usuários
router.get('/', listUsuarios);

// Obter usuário por Email
router.get('/by-email', getUsuarioByEmailController);

// Obter usuário por ID
router.get('/:id', getUsuario);

// Criar um novo usuário
router.post('/', createUsuarioValidator, createUsuarioController);

// Atualizar um usuário
router.patch('/:id', updateUsuarioController);

// Deletar um usuário
router.delete('/:id', deleteUsuarioController);

export default router;