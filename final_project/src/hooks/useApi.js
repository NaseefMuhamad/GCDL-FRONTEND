// import { useState, useCallback } from "react";

// export function useApi(endpoint) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       if (endpoint === "/api/analytics") {
//         setData({
//           kpis: {
//             totalSales: 12500,
//             procurementCosts: 7500,
//             stockTurnover: 2.5,
//             profitMargin: 28,
//           },
//           salesTrend: {
//             labels: ["Jan", "Feb", "Mar", "Apr"],
//             datasets: [
//               {
//                 label: "Sales ($)",
//                 data: [5000, 7000, 6000, 8000],
//                 borderColor: "#1e40af",
//                 backgroundColor: "rgba(30, 64, 175, 0.2)",
//                 fill: true,
//               },
//             ],
//           },
//           stockLevels: {
//             labels: ["Beans", "Rice", "Maize"],
//             datasets: [
//               {
//                 label: "Stock (tons)",
//                 data: [10, 8, 15],
//                 backgroundColor: "#1e40af",
//               },
//             ],
//           },
//         });
//       } else if (endpoint === "/api/credit-sales") {
//         setData([]);
//       } else if (endpoint === "/api/sales") {
//         setData([]);
//       } else if (endpoint === "/api/procurements") {
//         setData([]);
//       } else if (endpoint === "/api/stock") {
//         setData([]);
//       } else if (endpoint === "/api/login") {
//         setData({ token: "mock-token", username: "user" });
//       }
//       setError(null);
//     } catch (err) {
//       setError("Failed to fetch data");
//       setData(null);
//     } finally {
//       setLoading(false);
//     }
//   }, [endpoint]); // Dependency: endpoint

//   return { data, loading, error, fetchData };
// }

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api'; // Adjust if different

export function useApi(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch data on mount (GET request)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          },
        });
        setData(response.data.data); // Backend returns { total, data }
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) {
      fetchData();
    }
  }, [endpoint, user]);

  // Execute POST or other methods
  const execute = async (payload, method = 'POST') => {
    setLoading(true);
    try {
      console.log('Sending payload:', JSON.stringify(payload, null, 2));
      const cleanPayload = {
        produceName: String(payload.produceName),
        tonnage: parseFloat(payload.tonnage),
        amountPaid: parseFloat(payload.amountPaid),
        buyerName: String(payload.buyerName),
        salesAgentName: String(payload.salesAgentName),
        date: String(payload.date),
        time: String(payload.time),
        buyerContact: String(payload.buyerContact),
      };

      const response = await axios({
        method,
        url: `${API_URL}/${endpoint}`,
        data: cleanPayload,
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });
      // Update data with new sale
      setData((prev) => (prev ? [...prev, response.data.data] : [response.data.data]));
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to execute request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}