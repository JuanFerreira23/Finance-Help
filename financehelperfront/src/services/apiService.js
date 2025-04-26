import axios from "axios";
import { getAccessToken } from "./loginService";

const API_URL = "https://localhost:7219/api";

const getUserId = () => localStorage.getItem("idUsuario");

export const fetchGastos = async () => {
  const token = getAccessToken();
  const usuarioId = getUserId();

  const response = await axios.get(
    `${API_URL}/Gasto/usuario/${usuarioId}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  // aqui você pega diretamente o array de gastos
  return response.data.dados; 
};

export const addGasto = async (gasto) => {
  const token = getAccessToken();
  const usuarioId = getUserId();

  const response = await axios.post(`${API_URL}/Gasto/usuario/${usuarioId}`,
    gasto,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  // se você quiser já retornar o array atualizado:
  return response.data.dados; 
};

export const fetchResumoMensal = async (mes, ano) => {
  const token = getAccessToken();
  const usuarioId = getUserId();

  const response = await axios.get(
    `${API_URL}/Gasto/resumo/${usuarioId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { mes, ano }
    }
  );
  return response.data.dados;
};
