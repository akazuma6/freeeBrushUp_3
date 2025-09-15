import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

/**
 * お客様一組の情報を、指定された座標に表示するコンポーネント
 */
const CustomerTable = ({ customer, x, y }) => {
  const { id, people, entryTime, exitTime, status, memo } = customer;
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    if (status === 'occupied' && entryTime) {
      const calculateRemaining = () => {
        const now = dayjs();
        const totalMinutes = 120 + (customer.extension_minutes || 0);
        const exitTime = dayjs(entryTime).add(totalMinutes, 'minute');
        const diff = exitTime.diff(now, 'second'); // 秒単位で差を計算
        setRemainingTime(diff > 0 ? diff : 0);
      };

      calculateRemaining();
      const interval = setInterval(calculateRemaining, 1000); // 1秒ごとに更新

      return () => clearInterval(interval); // コンポーネントのアンマウント時にクリア
    } else {
      setRemainingTime(null);
    }
  }, [status, entryTime, customer.extension_minutes]);

  const handleTableClick = () => {
    navigate(`/table/${id}`);
  };

  const backgroundColor = status === 'occupied' ? 'primary.main' : 'grey.300';
  const textColor = status === 'occupied' ? 'white' : 'black';

  return (
    <Paper
      elevation={3}
      onClick={handleTableClick}
      sx={{
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
        width: 200,
        height: 150,
        borderRadius: 2,
        padding: 2,
        bgcolor: backgroundColor,
        color: textColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 6,
          zIndex: 1,
        }
      }}
    >
      {status === 'occupied' ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography variant="body2">{id}卓</Typography>
            {remainingTime !== null && (
              <Typography variant="h6" color="secondary.light">
                残り {Math.floor(remainingTime / 60)}分{remainingTime % 60}秒
              </Typography>
            )}
          </Box>
          <Typography variant="h6">{people || '-'}名様</Typography>
          <Typography variant="body2">
            入店: {entryTime ? dayjs(entryTime).format('HH:mm') : '--:--'}
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {memo ? `メモ: ${memo}` : ''}
          </Typography>
        </>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body2">{id}卓</Typography>
            <Typography variant="h6">ご案内待ち</Typography>
        </Box>
      )}
    </Paper>
  );
};

// --- このコンポーネントの使い方 ---
export default function TablesStatus() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/tables/');
        const data = await response.json();
        setTables(data);
      } catch (error) {
        console.error("Failed to fetch tables:", error);
      }
    };

    fetchTables();
    const interval = setInterval(fetchTables, 60000 * 5); // 5分ごとにデータを再取得
    return () => clearInterval(interval);
  }, []);

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
        height: '480px', // 高さを少し増やします
        width: '100%', // 幅を100%に広げます
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

