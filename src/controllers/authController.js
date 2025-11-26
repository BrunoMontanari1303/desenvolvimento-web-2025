import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'
import {
  getUserWithHashByEmail,
  getUsuarioByEmailFromDB,
  createUsuarioInDB,
} from '../repositories/usuarioRepository.js'

export const loginController = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: 'error', message: 'email e password são obrigatórios' })
    }

    const user = await getUserWithHashByEmail(email)
    if (!user?.senha_hash) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Credenciais inválidas' })
    }

    const ok = await bcrypt.compare(password, user.senha_hash)
    if (!ok) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Credenciais inválidas' })
    }

    const token = jwt.sign(
      { sub: user.id, role: user.papel || 'user' },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '8h' }
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
        token, // <- e também dentro de data (compatível com muito front)
      },
    })
  } catch (e) {
    next(e)
  }
}

// REGISTRO PÚBLICO (cria USER)
export const registerController = async (req, res, next) => {
  try {
    // Erros vindos do express-validator na rota
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
    const password = String(req.body.password || '')

    if (!nome || !email || !password) {
      return res
        .status(400)
        .json({ status: 'error', message: 'nome, email e password são obrigatórios' })
    }

    // Verifica se já existe usuário com esse e-mail
    const existing = await getUsuarioByEmailFromDB(email)
    if (existing) {
      return res
        .status(409)
        .json({ status: 'error', message: 'Já existe um usuário com esse e-mail' })
    }

    // Cria usuário como USER (2)
    const senha_hash = await bcrypt.hash(password, 10)
    const papel = 2 // USER

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