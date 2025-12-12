import { pool } from '../database/db.js';

// Listar todos os motoristas com paginação
export const getAllMotoristasFromDB = async (limit, offset, sortBy, order, usuarioId = null) => {
  const baseOrder = `ORDER BY ${sortBy} ${order} LIMIT $1 OFFSET $2`;

  if (usuarioId) {
    const result = await pool.query(
      `SELECT * FROM motoristas WHERE usuarioId = $3 ${baseOrder}`,
      [limit, offset, usuarioId]
    );
    return result.rows;
  }

  const result = await pool.query(
    `SELECT * FROM motoristas ${baseOrder}`,
    [limit, offset]
  );
  return result.rows;
};

// Obter motorista por ID
export const getMotoristaByIdFromDB = async (id) => {
  const result = await pool.query('SELECT * FROM motoristas WHERE id = $1', [id]);
  return result.rows[0];
};

// Criar um novo motorista
export const createMotoristaInDB = async (nome, cpf, veiculoId, usuarioId) => {
  const result = await pool.query(
    `INSERT INTO motoristas (nome, cpf, veiculoId, usuarioId)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [nome, cpf, veiculoId, usuarioId]
  );
  return result.rows[0];
};

// Atualizar motorista
export const updateMotoristaInDB = async (id, nome, cpf, veiculoId) => {
  const result = await pool.query(
    'UPDATE motoristas SET nome = $1, cpf = $2, veiculoId = $3, dataAtualizacao = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
    [nome, cpf, veiculoId, id]
  );
  return result.rowCount > 0 ? result.rows[0] : null;
};

// Deletar motorista
export const deleteMotoristaFromDB = async (id) => {
  const result = await pool.query('DELETE FROM motoristas WHERE id = $1 RETURNING *', [id]);
  return result.rowCount > 0 ? result.rows[0] : null;
};
