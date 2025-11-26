import { pool } from '../database/db.js';

// Listar todos os pedidos de transporte com paginação
export const getAllPedidoTransportesFromDB = async (limit, offset, sortBy, order) => {
  // Evitar SQL injection: whitelist
  const allowedSort = ['id','origem','destino','dataEntrega','status']
  const safeSortBy = allowedSort.includes(sortBy) ? sortBy : 'id'
  const safeOrder  = order === 'ASC' ? 'ASC' : 'DESC'

  const result = await pool.query(
    `SELECT *, COUNT(*) OVER() AS total_count
     FROM pedidos
     ORDER BY ${safeSortBy} ${safeOrder}
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  )
  return { rows: result.rows, total: result.rows[0]?.total_count ?? 0 }
}

// Obter pedido de transporte por ID
export const getPedidoTransporteByIdFromDB = async (id) => {
  const result = await pool.query('SELECT * FROM pedidos WHERE id = $1', [id]);
  return result.rows[0]; // Retorna o primeiro pedido encontrado ou undefined se não encontrado
};

// Criar um novo pedido de transporte
export const createPedidoTransporteInDB = async (origem, destino, tipoCarga, dataEntrega, status, veiculoId, motoristaId, quantidade) => {
  const result = await pool.query(
    'INSERT INTO pedidos (origem, destino, tipoCarga, dataEntrega, status, veiculoId, motoristaId, quantidade) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [origem, destino, tipoCarga, dataEntrega, status, veiculoId ?? null, motoristaId ?? null, quantidade]
  );
  return result.rows[0]; // Retorna o pedido de transporte criado
};

// Atualizar um pedido de transporte
export const updatePedidoTransporteInDB = async (id, origem, destino, tipoCarga, dataEntrega, status, veiculoId, motoristaId, quantidade) => {
  const result = await pool.query(
    'UPDATE pedidos SET origem = $1, destino = $2, tipoCarga = $3, dataEntrega = $4, status = $5, veiculoId = $6, motoristaId = $7, quantidade = $8, dataAtualizacao = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
    [origem, destino, tipoCarga, dataEntrega, status, veiculoId, motoristaId, quantidade, id]
  )
  return result.rowCount > 0 ? result.rows[0] : null; // Se o pedido for encontrado e atualizado, retorna o pedido atualizado
};

// Atualizar status do pedido
export const updatePedidoStatusInDB = async (id, status) => {
  const result = await pool.query(
    `UPDATE pedidos SET status = $1, dataAtualizacao = NOW() WHERE id = $2 RETURNING *;`,
    [status, id]
  )
  return result.rowCount > 0 ? result.rows[0] : null
}

// Aceitar pedido de transporte: define veículo, motorista e altera status para ACEITO
export const acceptPedidoTransporteInDB = async (id, veiculoId, motoristaId) => {
  const result = await pool.query(
    `
      UPDATE pedidos
         SET status = $1,
             veiculoId = $2,
             motoristaId = $3,
             dataAtualizacao = NOW()
       WHERE id = $4
       RETURNING *;
    `,
    ['ACEITO', veiculoId, motoristaId, id]
  )

  return result.rowCount > 0 ? result.rows[0] : null
}

// Deletar um pedido de transporte
export const deletePedidoTransporteFromDB = async (id) => {
  const result = await pool.query('DELETE FROM pedidos WHERE id = $1 RETURNING *', [id]);
  return result.rowCount > 0 ? result.rows[0] : null; // Retorna o pedido deletado ou null se não encontrado
};


