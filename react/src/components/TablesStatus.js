import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { API_BASE_URL } from '../config';
import CustomerTable from './CustomerTable';

export default function TablesStatus() {
  const [tables, setTables] = useState([]);

  const axiosTables = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tables/`);
      setTables(response.data);
    } catch (error) {
      console.error("axiosによるtables取得失敗:", error);
    }
  }, []);

  useEffect(() => {
    axiosTables();
    const interval = setInterval(axiosTables, 60000); // 1分ごとにデータを再取得
    return () => clearInterval(interval);
  }, [axiosTables]);

  const tableLayout = tables.map((table, index) => {
    const positions = [
        { x: 50, y: 50 },
        { x: 300, y: 50 },
        { x: 550, y: 50 },
        { x: 50, y: 240 },
        { x: 300, y: 240 },
        { x: 550, y: 240 },
    ];
    return {
        customer: table, // APIからのデータをcustomerとして渡す
        position: positions[index] || { x: 50, y: 430 } // データが6個以上ある場合の位置
    };
  });

  return (
    <Box
      sx={{
        position: 'relative',
        height: '480px',
        width: '100%', 
        border: '2px solid #ddd',
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" sx={{ p: 2, position: 'absolute' }}>座席表</Typography>
      
      {tableLayout.map(item => (
        <CustomerTable
          key={item.customer.id} 
          customer={item.customer}
          x={item.position.x}
          y={item.position.y}
        />
      ))}
    </Box>
  );
}

