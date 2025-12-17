import bcrypt from 'bcrypt'
import { getUsuarioById, updateUsuario, deleteUsuario, getAllUsuarios, getUsuarioByEmail } from '../services/usuarioService.js';
import { body, param, validationResult } from 'express-validator';

const ROLE_MAP_IN = {
  'ADMIN': 1,
  'USER': 2,
  'GESTOR': 3,
}

const normRole = (v) => {
  if (!v) return 2
  const key = String(v).trim().toUpperCase()
  return ROLE_MAP_IN[key] ?? 2
}

// Listar todos os usuários com paginação e ordenação
export const listUsuarios = async (req, res) => {
  try {
    const usuarios = await getAllUsuarios(req.query);
    res.json({
      status: 'success',
      message: 'Usuários encontrados.',
      data: usuarios,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getUsuarioByEmailController = async (req, res, next) => {
  try {
    const email = String(req.query.email || '').trim().toLowerCase()
    if (!email) return res.status(400).json({ status: 'error', message: 'email é obrigatório' })

    const user = await getUsuarioByEmail(email)
    if (!user) return res.status(404).json({ status: 'error', message: 'Usuário não encontrado' })

    res.json({ status: 'success', data: user })
  } catch (e) { next(e) }
}

// Obter usuário por ID
export const getUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await getUsuarioById(id);
    if (!usuario) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado.',
      });
    }
    res.json({
      status: 'success',
      message: 'Usuário encontrado.',
      data: usuario,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Atualizar usuário
export const updateUsuarioController = [
  param('id').isInt().withMessage('O ID deve ser um número inteiro'),
  body('nome').optional().notEmpty().withMessage('O nome não pode estar vazio'),
  body('email').optional().isEmail().withMessage('O email deve ser válido'),
  body('senha').optional().isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
  body('papel').optional().isInt().withMessage('O papel deve ser um número inteiro'),

  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: 'error',
        message: 'Erro de validação',
        errors: errors.array(),
      })
    }

    const { id } = req.params
    const { nome, email, senha, papel } = req.body

    try {
      const usuarioExistente = await getUsuarioById(id)
      if (!usuarioExistente) {
        return res.status(404).json({
          status: 'error',
          message: 'Usuário não encontrado.',
        })
      }

      let senha_hash = usuarioExistente.senha_hash
      if (senha && senha.length >= 6) {
        senha_hash = await bcrypt.hash(senha, 10)
      }

      const papel_code =
        papel !== undefined && papel !== null
          ? normRole(papel)
          : usuarioExistente.papel

      const usuarioAtualizado = await updateUsuario(id, {
        nome: nome ?? usuarioExistente.nome,
        email: email ? email.toLowerCase() : usuarioExistente.email,
        senha_hash,           
        papel: papel_code,
      })

      return res.json({
        status: 'success',
        message: 'Usuário atualizado com sucesso.',
        data: usuarioAtualizado,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ status: 'error', message: error.message })
    }
  },
]

export const updateUsuarioAtualController = [
  body('nome').optional().notEmpty().withMessage('O nome não pode estar vazio'),
  body('email').optional().isEmail().withMessage('O email deve ser válido'),
  body('senha').optional().isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),

  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: 'error',
        message: 'Erro de validação',
        errors: errors.array(),
      })
    }

    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não autenticado.',
      })
    }

    const { nome, email, senha } = req.body

    try {
      const usuarioExistente = await getUsuarioById(userId)
      if (!usuarioExistente) {
        return res.status(404).json({
          status: 'error',
          message: 'Usuário não encontrado.',
        })
      }

      let senha_hash = usuarioExistente.senha_hash
      if (senha && senha.length >= 6) {
        senha_hash = await bcrypt.hash(senha, 10)
      }

      const usuarioAtualizado = await updateUsuario(userId, {
        nome: nome ?? usuarioExistente.nome,
        email: email ? email.toLowerCase() : usuarioExistente.email,
        senha_hash,
        papel: usuarioExistente.papel,
      })

      return res.json({
        status: 'success',
        message: 'Perfil atualizado com sucesso.',
        data: usuarioAtualizado,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ status: 'error', message: error.message })
    }
  },
]

export const getUsuarioSelfOrAdminController = async (req, res, next) => {
  try {
    const targetId = Number(req.params.id)
    const requesterId = Number(req.user?.id)
    const role = String(req.user?.role || '').toUpperCase()

    const isAdmin = role === 'ADMIN'
    const isOwner = requesterId === targetId

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        status: 'error',
        message: 'Você só pode acessar o próprio perfil.',
      })
    }

    const usuario = await getUsuarioById(targetId)
    if (!usuario) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado.',
      })
    }

    return res.json({
      status: 'success',
      message: 'Usuário encontrado.',
      data: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
      },
    })
  } catch (e) {
    next(e)
  }
}

export const updateUsuarioSelfOrAdminController = [
  param('id').isInt().withMessage('O ID deve ser um número inteiro'),
  body('nome').optional().notEmpty().withMessage('O nome não pode estar vazio'),
  body('email').optional().isEmail().withMessage('O email deve ser válido'),
  body('senha').optional().isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
  body('papel').optional(),

  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: 'error',
        message: 'Erro de validação',
        errors: errors.array(),
      })
    }

    const targetId = Number(req.params.id)
    const requesterId = Number(req.user?.id)
    const role = String(req.user?.role || '').toUpperCase()

    const isAdmin = role === 'ADMIN'
    const isOwner = requesterId === targetId

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        status: 'error',
        message: 'Você só pode editar o próprio perfil.',
      })
    }

    const { nome, email, senha, papel } = req.body

    try {
      const usuarioExistente = await getUsuarioById(targetId)
      if (!usuarioExistente) {
        return res.status(404).json({
          status: 'error',
          message: 'Usuário não encontrado.',
        })
      }

      let senha_hash = usuarioExistente.senha_hash
      if (senha && String(senha).length >= 6) {
        senha_hash = await bcrypt.hash(String(senha), 10)
      }

      // Se NÃO for admin, ignora qualquer tentativa de mudar papel
      const papel_final = isAdmin
        ? (papel !== undefined && papel !== null ? normRole(papel) : usuarioExistente.papel)
        : usuarioExistente.papel

      const usuarioAtualizado = await updateUsuario(targetId, {
        nome: nome ?? usuarioExistente.nome,
        email: email ? String(email).toLowerCase() : usuarioExistente.email,
        senha_hash,
        papel: papel_final,
      })

      return res.json({
        status: 'success',
        message: isAdmin && !isOwner
          ? 'Usuário atualizado com sucesso.'
          : 'Perfil atualizado com sucesso.',
        data: usuarioAtualizado,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ status: 'error', message: error.message })
    }
  },
]

// Deletar usuário
export const deleteUsuarioController = [
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
      // Verifica se o usuário existe antes de tentar deletar
      const usuarioExistente = await getUsuarioById(id);
      if (!usuarioExistente) {
        return res.status(404).json({
          status: 'error',
          message: 'Usuário não encontrado.',
        });
      }

      // Deleta o usuário no banco
      await deleteUsuario(id);
      res.status(204).json({
        status: 'success',
        message: 'Usuário deletado com sucesso.',
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
];