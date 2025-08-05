import axios from 'axios';

const API = 'http://88.200.63.148:9333/api';

export const login = async (data) => {
  const res = await axios.post(`${API}/login`, data, { withCredentials: true });
  return res.data;
};

export const register = async (data) => {
  const res = await axios.post(`${API}/register`, data, { withCredentials: true });
  return res.data;
};

export const logout = async () => {
  const res = await axios.post(`${API}/logout`, {}, { withCredentials: true });
  return res.data;
};
