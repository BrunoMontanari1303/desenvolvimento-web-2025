import express from 'express'
import { body } from 'express-validator'
import { loginController, registerController } from '../controllers/authController.js'

const router = express.Router()

// Login
router.post('/login', loginController)

// Registro público (cria sempre USER)
router.post(
  '/register',
  [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('E-mail inválido'),
    body('senha')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter pelo menos 6 caracteres'),
    body('tipoPerfil')
      .optional()
      .isIn(['CLIENTE', 'TRANSPORTADORA'])
      .withMessage('tipoPerfil inválido'),
  ],

  registerController
)

export default router
