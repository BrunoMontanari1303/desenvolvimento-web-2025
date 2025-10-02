import express from 'express'
import { pool } from '../database/db.js'

const router = express.Router()

// Listar todos os pedidos
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM PedidoTransporte ORDER BY id DESC')
  res.json(result.rows)
})

// Criar novo pedido
router.post('/', async (req, res) => {
  const { origem, destino, tipoCarga, dataEntrega, status, veiculoId, motoristaId } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO PedidoTransporte (origem, destino, tipoCarga, dataEntrega, status, veiculoId, motoristaId) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [origem, destino, tipoCarga, dataEntrega, status, veiculoId, motoristaId]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Atualizar pedido
router.patch('/:id', async (req, res) => {
  const { origem, destino, tipoCarga, dataEntrega, status, veiculoId, motoristaId } = req.body
  const { id } = req.params
  const result = await pool.query(
    'UPDATE PedidoTransporte SET origem = $1, destino = $2, tipoCarga = $3, dataEntrega = $4, status = $5, veiculoId = $6, motoristaId = $7, dataAtualizacao = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
    [origem, destino, tipoCarga, dataEntrega, status, veiculoId, motoristaId, id]
  )
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Pedido não encontrado' })
  }
  res.json(result.rows[0])
})

// Deletar pedido
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const result = await pool.query('DELETE FROM PedidoTransporte WHERE id = $1 RETURNING *', [id])
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Pedido não encontrado' })
  }
  res.status(204).send()
})

export default router