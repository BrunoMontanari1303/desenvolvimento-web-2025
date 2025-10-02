import express from 'express'
import { pool } from '../database/db.js'

const router = express.Router()

// Listar todos os usuários
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM Usuario ORDER BY id DESC')
  res.json(result.rows)
})

// Criar novo usuário
router.post('/', async (req, res) => {
  const { nome, email, senha_hash, papel } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO Usuario (nome, email, senha_hash, papel) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, email, senha_hash, papel]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Atualizar usuário
router.patch('/:id', async (req, res) => {
  const { nome, email, senha_hash, papel } = req.body
  const { id } = req.params
  const result = await pool.query(
    'UPDATE Usuario SET nome = $1, email = $2, senha_hash = $3, papel = $4, dataAtualizacao = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
    [nome, email, senha_hash, papel, id]
  )
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Usuário não encontrado' })
  }
  res.json(result.rows[0])
})

// Deletar usuário
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const result = await pool.query('DELETE FROM Usuario WHERE id = $1 RETURNING *', [id])
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Usuário não encontrado' })
  }
  res.status(204).send()
})

export default router