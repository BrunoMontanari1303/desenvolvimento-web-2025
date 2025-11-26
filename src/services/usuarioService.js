import { createUsuarioInDB, getUsuarioByIdFromDB, updateUsuarioInDB, deleteUsuarioFromDB, getAllUsuariosFromDB, getUsuarioByEmailFromDB } from '../repositories/usuarioRepository.js';

const papelMapOut = {
  1: 'ADMIN',
  2: 'USER',
  3: 'GESTOR',
  '1': 'ADMIN',
  '2': 'USER',
  '3': 'GESTOR'
}


// Listar todos os usuários com paginação
export const getAllUsuarios = async (queryParams) => {
  const { page = 1, limit = 10, sortBy = 'id', order = 'ASC' } = queryParams;
  const offset = (page - 1) * limit;
  return await getAllUsuariosFromDB(limit, offset, sortBy, order);
};

// Obter usuário porEmail
export const getUsuarioByEmail = async(email) => {
  if (!email || typeof email !== 'string') throw new Error('email é obrigatório')

  const normalized = email.trim().toLowerCase()
  const user = await getUsuarioByEmailFromDB(normalized)
  if (!user) return null

  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    papel: papelMapOut[user.papel] || user.papel,
  }
};

// Obter usuário por ID
export const getUsuarioById = async (id) => {
  return await getUsuarioByIdFromDB(id);
};

// Criar um novo usuário
export const createUsuario = async (data) => {
  const { nome, email, senha_hash, papel } = data;
  return await createUsuarioInDB(nome, email, senha_hash, papel);
};

// Atualizar um usuário
export const updateUsuario = async (id, data) => {
  const { nome, email, senha_hash, papel } = data
  return await updateUsuarioInDB(id, {nome, email, senha_hash, papel,})
};

// Deletar um usuário
export const deleteUsuario = async (id) => {
  return await deleteUsuarioFromDB(id);
};
