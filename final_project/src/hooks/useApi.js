import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

function useApi() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      Authorization: user ? `Bearer ${user.token}` : '',
    },
  });

  async function fetchData(endpoint, method = 'GET', data = null, params = {}) {
    setLoading(true);
    setError(null);

    try {
      if (user && user.role !== 'ceo') {
        params.branch = user.branch;
      }

      const response = await api({
        url: endpoint,
        method,
        data,
        params,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { fetchData, loading, error };
}

export default useApi;