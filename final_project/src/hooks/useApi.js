import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api'; // Backend URL

export function useApi(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();

  // Fetch data on mount or endpoint/token change (GET request)
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!token) return; // Skip fetch if no token

      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (isMounted) {
          setData(response.data); // Backend returns { data: [...] } for dashboard
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.error || 'Failed to fetch data');
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup to prevent state updates after unmount
    };
  }, [endpoint, token]);

  // Execute POST, PUT, DELETE, or other methods
  const execute = async (payload = null, method = 'POST') => {
    if (!token) {
      throw new Error('No authentication token available');
    }

    setLoading(true);
    try {
      const config = {
        method,
        url: `${API_URL}/${endpoint}`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      if (payload) {
        config.data = payload; // Use payload as-is, no hardcoded cleaning
      }

      const response = await axios(config);
      // Update data for GET endpoints if needed (e.g., after POST)
      if (method === 'POST' && endpoint.startsWith('dashboard/')) {
        // Refetch for dashboard to ensure charts update
        const refetch = await axios.get(`${API_URL}/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setData(refetch.data);
      } else {
        setData(response.data);
      }
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to execute request';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}