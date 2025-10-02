import express from 'express'
import { pool } from '../database/db.js'

const router = express.Router()

// Listar todos os veículos
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM Veiculo ORDER BY id DESC')
  res.json(result.rows)
})

// Criar novo veículo
router.post('/', async (req, res) => {
  const { placa, modelo, capacidade, status } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO Veiculo (placa, modelo, capacidade, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [placa, modelo, capacidade, status]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Atualizar veículo
router.patch('/:id', async (req, res) => {
  const { placa, modelo, capacidade, status } = req.body
  const { id } = req.params
  const result = await pool.query(
    'UPDATE Veiculo SET placa = $1, modelo = $2, capacidade = $3, status = $4, dataAtualizacao = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
    [placa, modelo, capacidade, status, id]
  )
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Veículo não encontrado' })
  }
  res.json(result.rows[0])
})

// Deletar veículo
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const result = await pool.query('DELETE FROM Veiculo WHERE id = $1 RETURNING *', [id])
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Veículo não encontrado' })
  }
  res.status(204).send()
})

export default router
