import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'
import {
  getUserWithHashByEmail,
  getUsuarioByEmailFromDB,
  createUsuarioInDB,
} from '../repositories/usuarioRepository.js'

const TIPO_PERFIL_MAP = {
  CLIENTE: 2,    
  TRANSPORTADORA: 3,
}

function resolvePapelFromTipoPerfil(rawTipoPerfil) {
  if (!rawTipoPerfil) return 2 // default CLIENTE/USER

  const key = String(rawTipoPerfil).trim().toUpperCase()
  return TIPO_PERFIL_MAP[key] ?? 2 // se vier algo estranho, volta pra 2
}

export const loginController = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const senha = String(req.body.senha || '')

    if (!email || !senha) {
      return res
        .status(400)
        .json({ status: 'error', message: 'email e senha são obrigatórios' })
    }

    const user = await getUserWithHashByEmail(email)
    if (!user?.senha_hash) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Credenciais inválidas' })
    }

    const ok = await bcrypt.compare(senha, user.senha_hash)
    if (!ok) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Credenciais inválidas' })
    }

    const token = jwt.sign(
      { sub: user.id, role: user.papel || 'user' },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '1h' }
    )

    // Envia de formas redundantes para não ter erro no front
    res.setHeader('Authorization', `Bearer ${token}`)
    return res.json({
      status: 'success',
      message: 'Login realizado com sucesso.',
      token, // <- direto aqui
      data: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        papel: user.papel,
        token,
      },
    })
  } catch (e) {
    next(e)
  }
}

export const registerController = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: 'error',
        message: 'Dados inválidos',
        errors: errors.array(),
      })
    }

    const nome = String(req.body.nome || '').trim()
    const email = String(req.body.email || '').trim().toLowerCase()
    const senha = String(req.body.senha || '')
    const tipoPerfil = req.body.tipoPerfil // pode vir CLIENTE, TRANSPORTADORA ou undefined

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ status: 'error', message: 'nome, email e senha são obrigatórios' })
    }

    // Verifica se já existe usuário com esse e-mail
    const existing = await getUsuarioByEmailFromDB(email)
    if (existing) {
      return res
        .status(409)
        .json({ status: 'error', message: 'Já existe um usuário com esse e-mail' })
    }

    const senha_hash = await bcrypt.hash(senha, 10)

    const papel = resolvePapelFromTipoPerfil(tipoPerfil)

    const novoUsuario = await createUsuarioInDB(nome, email, senha_hash, papel)

    return res.status(201).json({
      status: 'success',
      message: 'Usuário criado com sucesso',
      data: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        papel: novoUsuario.papel,
      },
    })
  } catch (e) {
    next(e)
  }
}