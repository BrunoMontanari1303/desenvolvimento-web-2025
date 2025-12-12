import { createVeiculoInDB, getVeiculoByIdFromDB, updateVeiculoInDB, deleteVeiculoFromDB, getAllVeiculosFromDB } from '../repositories/veiculoRepository.js';

// Listar todos os veículos com paginação
export const getAllVeiculos = async (queryParams, user) => {
  const { page = 1, limit = 10, sortBy = 'id', order = 'DESC' } = queryParams;
  const offset = (page - 1) * limit;

  const isAdmin = user && (user.papel === 1 || user.papel === 'ADMIN');

  return await getAllVeiculosFromDB(
    limit,
    offset,
    sortBy,
    order,
    isAdmin ? null : user.id // se não for admin, filtra por id
  );
};

// Obter veículo por ID
export const getVeiculoById = async (id) => {
  return await getVeiculoByIdFromDB(id);
};

// Criar um novo veículo
export const createVeiculo = async (data) => {
  const { placa, modelo, capacidade, status, usuarioId } = data;
  return await createVeiculoInDB(placa, modelo, capacidade, status, usuarioId);
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
