import { createMotoristaInDB, getMotoristaByIdFromDB, updateMotoristaInDB, deleteMotoristaFromDB, getAllMotoristasFromDB } from '../repositories/motoristaRepository.js';

// Listar todos os motoristas com paginação
export const getAllMotoristas = async (queryParams) => {
  const { page = 1, limit = 10, sortBy = 'id', order = 'DESC' } = queryParams;
  const offset = (page - 1) * limit;
  return await getAllMotoristasFromDB(limit, offset, sortBy, order);
};

// Obter motorista por ID
export const getMotoristaById = async (id) => {
  return await getMotoristaByIdFromDB(id);
};

// Criar um novo motorista
export const createMotorista = async (data) => {
  const { nome, cpf, veiculoId } = data;
  return await createMotoristaInDB(nome, cpf, veiculoId);
};

// Atualizar motorista
export const updateMotorista = async (id, data) => {
  const { nome, cpf, veiculoId } = data;
  return await updateMotoristaInDB(id, nome, cpf, veiculoId);
};

// Deletar motorista
export const deleteMotorista = async (id) => {
  return await deleteMotoristaFromDB(id);
};
