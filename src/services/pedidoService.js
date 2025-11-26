import {
  createPedidoTransporteInDB,
  getPedidoTransporteByIdFromDB,
  updatePedidoTransporteInDB,
  deletePedidoTransporteFromDB,
  getAllPedidoTransportesFromDB,
  updatePedidoStatusInDB,
  acceptPedidoTransporteInDB
} from '../repositories/pedidoRepository.js';

// Listar todos os pedidos de transporte com paginação
export const getAllPedidoTransportes = async (query) => {
  const { page = 1, limit = 10, sortBy='id', order='DESC' } = query
  const offset = (page - 1) * limit
  const { rows, total } = await getAllPedidoTransportesFromDB(limit, offset, sortBy, order)
  return { data: rows, meta: { page: Number(page), perPage: Number(limit), total } }
}

// Obter pedido de transporte por ID
export const getPedidoTransporteById = async (id) => {
  return await getPedidoTransporteByIdFromDB(id);
};

// Criar um novo pedido de transporte
export const createPedidoTransporte = async (data) => {
  const { origem, destino, tipoCarga, dataEntrega, status, veiculoId, motoristaId, quantidade} = data;
  return await createPedidoTransporteInDB(origem, destino, tipoCarga, dataEntrega, status, veiculoId, motoristaId, quantidade);
};

// Atualizar pedido de transporte
export const updatePedidoTransporte = async (id, data) => {
  const { origem, destino, tipoCarga, dataEntrega, status, veiculoId, motoristaId, quantidade} = data;
  return await updatePedidoTransporteInDB(id, origem, destino, tipoCarga, dataEntrega, status, veiculoId, motoristaId, quantidade);
};

// Aceitar pedido de transporte
export const acceptPedidoTransporte = async (id, veiculoId, motoristaId) => {
  return await acceptPedidoTransporteInDB(id, veiculoId, motoristaId)
}


// Deletar pedido de transporte
export const deletePedidoTransporte = async (id) => {
  return await deletePedidoTransporteFromDB(id);
};
