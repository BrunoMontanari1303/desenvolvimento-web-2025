import express from 'express'
import { pool } from '../database/db.js'

const router = express.Router()

// Listar todos os motoristas
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM Motorista ORDER BY id DESC')
  res.json(result.rows)
})

// Criar novo motorista
router.post('/', async (req, res) => {
  const { nome, cpf, veiculoId } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO Motorista (nome, cpf, veiculoId) VALUES ($1, $2, $3) RETURNING *',
      [nome, cpf, veiculoId]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Atualizar motorista
router.patch('/:id', async (req, res) => {
  const { nome, cpf, veiculoId } = req.body
  const { id } = req.params
  const result = await pool.query(
    'UPDATE Motorista SET nome = $1, cpf = $2, veiculoId = $3, dataAtualizacao = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
    [nome, cpf, veiculoId, id]
  )
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Motorista não encontrado' })
  }
  res.json(result.rows[0])
})

// Deletar motorista
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const result = await pool.query('DELETE FROM Motorista WHERE id = $1 RETURNING *', [id])
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Motorista não encontrado' })
  }
  res.status(204).send()
})

export default router
