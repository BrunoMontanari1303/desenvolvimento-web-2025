import {
  createPedidoTransporte, getPedidoTransporteById, updatePedidoTransporte, deletePedidoTransporte, getAllPedidoTransportes, acceptPedidoTransporte
} from '../services/pedidoService.js';

import { body, param, validationResult } from 'express-validator';



// Listar todos os pedidos de transporte com paginação e ordenação
export const listPedidoTransportes = async (req, res) => {
  try {
    const pedidos = await getAllPedidoTransportes(req.query);
    res.json({ status: 'success', message: '...', ...pedidos }) // já vem com data+meta
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Obter pedido de transporte por ID
export const getPedidoTransporte = async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await getPedidoTransporteById(id);
    if (!pedido) {
      return res.status(404).json({
        status: 'error',
        message: 'Pedido de transporte não encontrado.',
      });
    }
    res.json({
      status: 'success',
      message: 'Pedido de transporte encontrado.',
      data: pedido,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Criar um novo pedido de transporte
export const createPedidoTransporteController = [
  // Validações dos dados de entrada
  body('origem').notEmpty().withMessage('A origem é obrigatória'),
  body('destino').notEmpty().withMessage('O destino é obrigatório'),
  body('tipoCarga').notEmpty().withMessage('O tipo de carga é obrigatório'),
  body('dataEntrega').isISO8601().withMessage('A data de entrega deve ser uma data válida (ISO 8601)'),
  body('status').notEmpty().withMessage('O status é obrigatório'),
  body('quantidade').isInt({ min: 1 }).withMessage('A quantidade deve ser um número inteiro maior ou igual a 1'),

  // Lógica do controller
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: 'error',
        message: 'Erro de validação',
        errors: errors.array(),
      });
    }

    const { origem, destino, tipoCarga, dataEntrega, status, veiculoId, motoristaId, quantidade } = req.body;

    try {
      const pedido = await createPedidoTransporte({ origem, destino, tipoCarga, dataEntrega, status, veiculoId, motoristaId, quantidade });
      res.status(201).json({
        status: 'success',
        message: 'Pedido de transporte criado com sucesso.',
        data: pedido,
      });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
];

// Atualizar pedido de transporte
export const updatePedidoTransporteController = [
  // Validação do ID
  param('id').isInt().withMessage('O ID deve ser um número inteiro'),

  // Validação dos dados de entrada
  body('origem').optional().notEmpty().withMessage('A origem não pode estar vazia'),
  body('destino').optional().notEmpty().withMessage('O destino não pode estar vazio'),
  body('tipoCarga').optional().notEmpty().withMessage('O tipo de carga não pode estar vazio'),
  body('dataEntrega').optional().isISO8601().withMessage('A data de entrega deve ser uma data válida (ISO 8601)'),
  body('status').optional().notEmpty().withMessage('O status não pode estar vazio'),
  body('quantidade').isInt({ min: 1 }).withMessage('A quantidade deve ser um número inteiro maior ou igual a 1'),


  // Lógica do controller
  async (req, res) => {
    // Validação dos parâmetros da requisição
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: 'error',
        message: 'Erro de validação',
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { origem, destino, tipoCarga, dataEntrega, status, veiculoId, motoristaId, quantidade } = req.body;

    try {
      // Verifica se o pedido existe antes de tentar atualizar
      const pedidoExistente = await getPedidoTransporteById(id);
      if (!pedidoExistente) {
        return res.status(404).json({
          status: 'error',
          message: 'Pedido de transporte não encontrado.',
        });
      }

      // Atualiza o pedido de transporte no banco
      const pedidoAtualizado = await updatePedidoTransporte(id, { origem, destino, tipoCarga, dataEntrega, status, veiculoId, motoristaId, quantidade });
      res.json({
        status: 'success',
        message: 'Pedido de transporte atualizado com sucesso.',
        data: pedidoAtualizado,
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
]

// Aceitar pedido
export const acceptPedidoTransporteController = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: 'error',
        message: 'Dados inválidos',
        errors: errors.array(),
      })
    }

    const id = Number(req.params.id)
    const { veiculoId, motoristaId } = req.body

    if (!id || !veiculoId || !motoristaId) {
      return res.status(400).json({
        status: 'error',
        message: 'id, veiculoId e motoristaId são obrigatórios',
      })
    }

    const pedido = await acceptPedidoTransporte(id, Number(veiculoId), Number(motoristaId))

    if (!pedido) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Pedido não encontrado' })
    }

    return res.json({
      status: 'success',
      message: 'Pedido aceito com sucesso',
      data: pedido,
    })
  } catch (err) {
    next(err)
  }
}

// Deletar pedido de transporte
export const deletePedidoTransporteController = [
  // Validação do ID
  param('id').isInt().withMessage('O ID deve ser um número inteiro'),

  // Lógica do controller
  async (req, res) => {
    // Validação dos parâmetros da requisição
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: 'error',
        message: 'Erro de validação',
        errors: errors.array(),
      });
    }

    const { id } = req.params;

    try {
      // Verifica se o pedido existe antes de tentar deletar
      const pedidoExistente = await getPedidoTransporteById(id);
      if (!pedidoExistente) {
        return res.status(404).json({
          status: 'error',
          message: 'Pedido de transporte não encontrado.',
        });
      }

      // Deleta o pedido de transporte no banco
      await deletePedidoTransporte(id);
      res.status(204).json({
        status: 'success',
        message: 'Pedido de transporte deletado com sucesso.',
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
];
