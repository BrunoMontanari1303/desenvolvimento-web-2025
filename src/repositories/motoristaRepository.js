import { pool } from '../database/db.js';

// Listar todos os motoristas com paginação
export const getAllMotoristasFromDB = async (limit, offset, sortBy, order) => {
  const result = await pool.query(
    `SELECT * FROM motoristas ORDER BY ${sortBy} ${order} LIMIT $1 OFFSET $2`,
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
export const createMotoristaInDB = async (nome, cpf, veiculoId) => {
  const result = await pool.query(
    'INSERT INTO motoristas (nome, cpf, veiculoId) VALUES ($1, $2, $3) RETURNING *',
    [nome, cpf, veiculoId]
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
