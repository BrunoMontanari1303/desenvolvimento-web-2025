import { createVeiculo, getVeiculoById, updateVeiculo, deleteVeiculo, getAllVeiculos } from '../services/veiculoService.js';
import { body, param, validationResult } from 'express-validator';


// Listar todos os veículos com paginação e ordenação
export const listVeiculos = async (req, res) => {
  try {
    const veiculos = await getAllVeiculos(req.query, req.user); // 👈 passou o user
    res.json({
      status: 'success',
      message: 'Veículos encontrados.',
      data: veiculos,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Obter veículo por ID
export const getVeiculo = async (req, res) => {
  try {
    const veiculo = await getVeiculoById(req.params.id);
    if (!veiculo) {
      return res.status(404).json({
        status: 'error',
        message: 'Veículo não encontrado.',
      });
    }
    res.json({
      status: 'success',
      message: 'Veículo encontrado.',
      data: veiculo,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Criar um novo veículo
export const createVeiculoController = [
  // Validações dos dados de entrada
  body('placa')
    .notEmpty().withMessage('A placa é obrigatória')
    .isLength({ min: 7, max: 7 }).withMessage('A placa deve ter 7 caracteres'),
  body('modelo')
    .notEmpty().withMessage('O modelo é obrigatório'),
  body('capacidade')
    .isFloat({ min: 0 }).withMessage('A capacidade deve ser um número positivo'),
  body('status')
    .notEmpty().withMessage('O status é obrigatório'),

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
      const usuarioId = req.user?.id
      if (!usuarioId) {
        return res.status(401).json({
          status: 'error',
          message: 'Usuário não autenticado.',
        })
      }

      const { placa, modelo, capacidade, status } = req.body

      const veiculo = await createVeiculo({
        placa: placa.trim(),
        modelo: modelo.trim(),
        capacidade: Number(capacidade),
        status,
        usuarioId, // 👈 agora existe
      })

      return res.status(201).json({
        status: 'success',
        message: 'Veículo criado com sucesso.',
        data: veiculo,
      })
    } catch (error) {
      console.error('Erro ao criar veículo:', error)
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao criar veículo.',
        details: error.message,
      })
    }
  },
]

// Atualizar veículo
export const updateVeiculoController = [
  // Validação do ID
  param('id').isInt().withMessage('O ID deve ser um número inteiro'),

  // Validação dos dados de entrada
  body('placa').optional().notEmpty().withMessage('A placa não pode estar vazia').isLength({ min: 7, max: 7 }).withMessage('A placa deve ter 7 caracteres'),
  body('modelo').optional().notEmpty().withMessage('O modelo não pode estar vazio'),
  body('capacidade').optional().isFloat({ min: 0 }).withMessage('A capacidade deve ser um número positivo'),
  body('status').optional().notEmpty().withMessage('O status não pode estar vazio'),

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
    const { placa, modelo, capacidade, status } = req.body;

    try {
      // Verifica se o veículo existe antes de tentar atualizar
      const veiculoExistente = await getVeiculoById(id);
      if (!veiculoExistente) {
        return res.status(404).json({
          status: 'error',
          message: 'Veículo não encontrado.',
        });
      }

      // Atualiza o veículo no banco
      const veiculoAtualizado = await updateVeiculo(id, { placa, modelo, capacidade, status });
      res.json({
        status: 'success',
        message: 'Veículo atualizado com sucesso.',
        data: veiculoAtualizado,
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
];

// Deletar veículo
export const deleteVeiculoController = [
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
      // Verifica se o veículo existe antes de tentar deletar
      const veiculoExistente = await getVeiculoById(id);
      if (!veiculoExistente) {
        return res.status(404).json({
          status: 'error',
          message: 'Veículo não encontrado.',
        });
      }

      // Deleta o veículo no banco
      await deleteVeiculo(id);
      res.status(204).json({
        status: 'success',
        message: 'Veículo deletado com sucesso.',
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
];
