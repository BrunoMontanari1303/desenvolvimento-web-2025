import { createVeiculoInDB, getVeiculoByIdFromDB, updateVeiculoInDB, deleteVeiculoFromDB, getAllVeiculosFromDB } from '../repositories/veiculoRepository.js';

// Listar todos os veículos com paginação
export const getAllVeiculos = async (queryParams) => {
  const { page = 1, limit = 10, sortBy = 'id', order = 'DESC' } = queryParams;
  const offset = (page - 1) * limit;
  return await getAllVeiculosFromDB(limit, offset, sortBy, order);
};

// Obter veículo por ID
export const getVeiculoById = async (id) => {
  return await getVeiculoByIdFromDB(id);
};

// Criar um novo veículo
export const createVeiculo = async (data) => {
  const { placa, modelo, capacidade, status } = data;
  return await createVeiculoInDB(placa, modelo, capacidade, status);
};

// Atualizar veículo
export const updateVeiculo = async (id, data) => {
  const { placa, modelo, capacidade, status } = data;
  return await updateVeiculoInDB(id, placa, modelo, capacidade, status);
};

// Deletar veículo
export const deleteVeiculo = async (id) => {
  return await deleteVeiculoFromDB(id);
};
