import { pool } from '../database/db.js';

// Listar todos os veículos com paginação
export const getAllVeiculosFromDB = async (limit, offset, sortBy, order) => {
  const result = await pool.query(
    `SELECT * FROM veiculos ORDER BY ${sortBy} ${order} LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
};

// Obter veículo por ID
export const getVeiculoByIdFromDB = async (id) => {
  const result = await pool.query('SELECT * FROM veiculos WHERE id = $1', [id]);
  return result.rows[0];
};

// Criar um novo veículo
export const createVeiculoInDB = async (placa, modelo, capacidade, status) => {
  const result = await pool.query(
    'INSERT INTO veiculos (placa, modelo, capacidade, status) VALUES ($1, $2, $3, $4) RETURNING *',
    [placa, modelo, capacidade, status]
  );
  return result.rows[0];
};

// Atualizar veículo
export const updateVeiculoInDB = async (id, placa, modelo, capacidade, status) => {
  const result = await pool.query(
    'UPDATE veiculos SET placa = $1, modelo = $2, capacidade = $3, status = $4, dataAtualizacao = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
    [placa, modelo, capacidade, status, id]
  );
  return result.rowCount > 0 ? result.rows[0] : null;
};

// Deletar veículo
export const deleteVeiculoFromDB = async (id) => {
  const result = await pool.query('DELETE FROM veiculos WHERE id = $1 RETURNING *', [id]);
  return result.rowCount > 0 ? result.rows[0] : null;
};
