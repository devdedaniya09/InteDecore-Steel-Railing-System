import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';

const AdminSalesChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const token = localStorage.getItem('adminAccessToken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/admin/sales-summary`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const formattedData = response.data.map(entry => ({
          month: `${monthNames[entry._id.month - 1]} ${entry._id.year}`,
          totalOrders: entry.totalOrders,
          totalRevenue: entry.totalRevenue
        }));

        setData(formattedData);
      } catch (err) {
        console.error('Failed to fetch sales summary', err);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Sales Analytics Overview</h2>

      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">📊 Monthly Orders & Revenue (Bar Chart)</h3>
        <div style={{ width: '95%', height: 400 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="totalOrders" fill="#8884d8" name="Orders" />
              <Bar yAxisId="right" dataKey="totalRevenue" fill="#82ca9d" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">📈 Revenue Trend (Line Chart)</h3>
        <div style={{ width: '95%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalRevenue" stroke="#00bfa5" strokeWidth={3} name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">📦 Order Volume Trend (Line Chart)</h3>
        <div style={{ width: '95%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalOrders" stroke="#5c6bc0" strokeWidth={3} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminSalesChart;
