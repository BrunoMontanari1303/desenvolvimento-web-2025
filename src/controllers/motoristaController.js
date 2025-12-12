import { createMotorista, getMotoristaById, updateMotorista, deleteMotorista, getAllMotoristas } from '../services/motoristaService.js';
import { body, param, validationResult } from 'express-validator';

// Listar todos os motoristas
export const listMotoristas = async (req, res) => {
  try {
    const motoristas = await getAllMotoristas(req.query, req.user); // 👈
    res.json({
      status: 'success',
      message: 'Motoristas encontrados.',
      data: motoristas,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Obter motorista por ID
export const getMotorista = async (req, res) => {
  try {
    const motorista = await getMotoristaById(req.params.id);
    if (!motorista) {
      return res.status(404).json({
        status: 'error',
        message: 'Motorista não encontrado.',
      });
    }
    res.json({
      status: 'success',
      message: 'Motorista encontrado.',
      data: motorista,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Criar um novo motorista
export const createMotoristaController = [
  // Validações dos dados de entrada
  body('nome')
    .notEmpty().withMessage('O nome é obrigatório'),

  body('cpf')
    .notEmpty().withMessage('O CPF é obrigatório')
    .isLength({ min: 11, max: 11 }).withMessage('O CPF deve ter 11 dígitos'),

  body('veiculoId')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('O veículo deve ser um ID inteiro positivo'),

  // Lógica do controller
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: 'error',
        message: 'Erro de validação',
        errors: errors.array(),
      })
    }

    try {
      // 👇 vem do JWT (ensureAuth precisa estar na rota)
      const usuarioId = req.user?.id
      if (!usuarioId) {
        return res.status(401).json({
          status: 'error',
          message: 'Usuário não autenticado.',
        })
      }

      let { nome, cpf, veiculoId } = req.body

      cpf = String(cpf).replace(/\D/g, '')

      veiculoId = veiculoId ? Number(veiculoId) : null

      const motorista = await createMotorista({
        nome: nome.trim(),
        cpf,
        veiculoId,
        usuarioId,
      })

      return res.status(201).json({
        status: 'success',
        message: 'Motorista criado com sucesso.',
        data: motorista,
      })
    } catch (error) {
      console.error('Erro ao criar motorista:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao criar motorista.',
        details: error.message,
      })
    }
  },
]

// Atualizar motorista
export const updateMotoristaController = [
  // Validação dos dados de entrada
  param('id').isInt().withMessage('O ID deve ser um número inteiro'),  // Validação do ID
  body('nome').optional().notEmpty().withMessage('O nome não pode estar vazio'),
  body('cpf').optional().isLength({ min: 11, max: 11 }).withMessage('O CPF deve ter 11 caracteres'),
  body('veiculoId').optional().isInt().withMessage('O ID do veículo deve ser um número inteiro'),

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
    const { nome, cpf, veiculoId } = req.body;

    try {
      // Verifica se o motorista existe antes de tentar atualizar
      const motoristaExistente = await getMotoristaById(id);
      if (!motoristaExistente) {
        return res.status(404).json({
          status: 'error',
          message: 'Motorista não encontrado.',
        });
      }

      // Atualiza o motorista no banco
      const motoristaAtualizado = await updateMotorista(id, { nome, cpf, veiculoId });
      res.json({
        status: 'success',
        message: 'Motorista atualizado com sucesso.',
        data: motoristaAtualizado,
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
];

// Deletar motorista
export const deleteMotoristaController = [
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
      // Verifica se o motorista existe antes de tentar deletar
      const motoristaExistente = await getMotoristaById(id);
      if (!motoristaExistente) {
        return res.status(404).json({
          status: 'error',
          message: 'Motorista não encontrado.',
        });
      }

      // Deleta o motorista no banco
      await deleteMotorista(id);
      res.status(204).json({
        status: 'success',
        message: 'Motorista deletado com sucesso.',
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
];
