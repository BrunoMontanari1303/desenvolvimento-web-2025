import express from 'express';
import { ensureAuth } from '../middlewares/authMiddleware.js';
import { body } from 'express-validator';
import {
  listPedidoTransportes,
  getPedidoTransporte,
  createPedidoTransporteController,
  updatePedidoTransporteController,
  deletePedidoTransporteController,
  acceptPedidoTransporteController,
} from '../controllers/pedidoController.js';


const router = express.Router();

// Listar todos os pedidos de transporte (qualquer usuário logado)
router.get('/', ensureAuth(), listPedidoTransportes);

// Obter pedido de transporte por ID
router.get('/:id', ensureAuth(), getPedidoTransporte);

// Criar um novo pedido de transporte
router.post('/', ensureAuth(), createPedidoTransporteController);

// Atualizar pedido de transporte (ADMIN ou GESTOR)
router.patch('/:id', ensureAuth(['ADMIN', 'GESTOR']), updatePedidoTransporteController);

// Aceitar pedido de transporte (apenas GESTOR)
router.patch(
  '/:id/aceitar',
  ensureAuth(['GESTOR']),
  [
    body('veiculoId')
      .isInt({ min: 1 })
      .withMessage('veiculoId deve ser um inteiro maior que zero'),
    body('motoristaId')
      .isInt({ min: 1 })
      .withMessage('motoristaId deve ser um inteiro maior que zero'),
  ],
  acceptPedidoTransporteController
);

// Deletar pedido de transporte (apenas ADMIN)
router.delete('/:id', ensureAuth(['ADMIN']), deletePedidoTransporteController);

export default router;
