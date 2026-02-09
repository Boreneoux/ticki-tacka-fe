import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const getEvents = async (query?: string) => {
  const res = await axios.get(`${API_URL}/events`, {
    params: {
      search: query,
    },
  });
  return res.data.data;
};
