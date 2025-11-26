import { pool } from '../database/db.js';

// Listar todos os usuários
export const getAllUsuariosFromDB = async (limit, offset, sortBy = 'id', order = 'ASC') => {
  const result = await pool.query(
    `SELECT * FROM usuarios ORDER BY ${sortBy} ${order} LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
};

export async function getUserWithHashByEmail(email) {
  const q = `
    SELECT id, nome, email, papel, senha_hash
    FROM usuarios
    WHERE LOWER(email) = LOWER($1)
    LIMIT 1
  `
  const r = await pool.query(q, [email])
  return r.rows[0]
}

// Obter usuário por Email
export const getUsuarioByEmailFromDB = async (email) => {
  const r = await pool.query('SELECT * FROM usuarios WHERE email = $1 LIMIT 1', [email])
  return r.rows[0]
}

// Obter usuário por ID
export const getUsuarioByIdFromDB = async (id) => {
  const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
  return result.rows[0]; // Retorna o primeiro usuário encontrado ou undefined se não encontrado
};

// Criar um novo usuário
export const createUsuarioInDB = async (nome, email, senha_hash, papel) => {
  const result = await pool.query(
    'INSERT INTO usuarios (nome, email, senha_hash, papel) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, papel',
    [nome, email, senha_hash, papel]
  )
  return result.rows[0]; // Retorna o usuário criado
};

// Atualizar um usuário
export const updateUsuarioInDB = async (id, { nome, email, senha_hash, papel }) => {
  const result = await pool.query(
    `
    UPDATE usuarios
    SET
      nome       = $1,
      email      = $2,
      senha_hash = $3,
      papel      = $4,
      dataAtualizacao = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING id, nome, email, papel;
    `,
    [nome, email, senha_hash, papel, id]
  )

  return result.rowCount > 0 ? result.rows[0] : null
}

// Deletar um usuário
export const deleteUsuarioFromDB = async (id) => {
  const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
  return result.rowCount > 0 ? result.rows[0] : null; // Retorna o usuário deletado ou null se não encontrado
};
