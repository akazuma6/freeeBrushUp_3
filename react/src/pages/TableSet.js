import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// MUI Materialから必要なコンポーネントをインポートします
import {
  Box,
  Paper,
  Typography,
  Button as MuiButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField
} from '@mui/material';
// 【修正点】タイムピッカー関連のインポートをこちらに移動します
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import dayjs from 'dayjs'; // dayjsをインポート

export default function TableSet() {
  const { tableId } = useParams();
  const navigate = useNavigate();

  // 各フォームの状態を管理
  const [status, setStatus] = useState('available');
  const [people, setPeople] = useState('');
  const [entryTime, setEntryTime] = useState(dayjs());
  const [memo, setMemo] = useState('');

  const fetchTableData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tables/${tableId}/`);
      const data = await response.json();
      setStatus(data.status || 'available');
      setPeople(data.people || '');
      setEntryTime(data.entryTime ? dayjs(data.entryTime) : dayjs());
      setMemo(data.memo || '');
    } catch (error) {
      console.error("Failed to fetch table data:", error);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [tableId]);

  const handleUpdate = async () => {
    const payload = {
      status,
      people: people === '' ? null : Number(people),
      entryTime: entryTime.toISOString(),
      memo,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tables/${tableId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        navigate('/'); // 更新成功後、座席表に戻る
      } else {
        console.error("Failed to update table");
      }
    } catch (error) {
      console.error("Error updating table:", error);
    }
  };

  const handleExit = async () => {
    const payload = {
      status: 'available',
      people: null,
      entryTime: null,
      exitTime: new Date().toISOString(),
      memo: '',
      extension_minutes: 0,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tables/${tableId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        navigate('/'); // 更新成功後、座席表に戻る
      } else {
        console.error("Failed to process exit");
      }
    } catch (error) {
      console.error("Error processing exit:", error);
    }
  };

  const handleExtend = async () => {
    // まず現在のテーブルデータを取得して最新の延長時間を知る
    try {
      const currentDataRes = await fetch(`http://127.0.0.1:8000/api/tables/${tableId}/`);
      const currentData = await currentDataRes.json();
      const newExtensionTime = (currentData.extension_minutes || 0) + 30;

      const response = await fetch(`http://127.0.0.1:8000/api/tables/${tableId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ extension_minutes: newExtensionTime }),
      });

      if (response.ok) {
        fetchTableData();
        alert('30分延長しました。');
      } else {
        console.error("Failed to extend time");
      }
    } catch (error) {
      console.error("Error extending time:", error);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, margin: 'auto' }} elevation={3}>
      <Typography variant="h4" gutterBottom>
        テーブル {tableId} の管理
      </Typography>

      {/* テーブル状況の選択 */}
      <FormControl fullWidth sx={{ mt: 4 }}>
        <InputLabel id="status-select-label">テーブルの状況</InputLabel>
        <Select
          labelId="status-select-label"
          value={status}
          label="テーブルの状況"
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="occupied">利用中</MenuItem>
          <MenuItem value="available">空席</MenuItem>
          <MenuItem value="reserved">予約</MenuItem>
        </Select>
      </FormControl>

      {/* 人数の入力 */}
      <FormControl fullWidth sx={{ mt: 3 }}>
        <TextField
          label="人数"
          type="number"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
        />
      </FormControl>
      
      {/* 入店時間の入力 */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>入店時間</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticTimePicker
            orientation="landscape"
            value={entryTime}
            onChange={(newValue) => setEntryTime(newValue)}
          />
        </LocalizationProvider>
      </Box>

      {/* メモの入力 */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>メモ</Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          variant="outlined"
        />
      </Box>

      {/* 操作ボタン */}
      <Box sx={{ mt: 4, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <MuiButton
          variant="outlined"
          color="error"
          onClick={handleExit}
          disabled={status !== 'occupied'}
        >
          退席（リセット）
        </MuiButton>
        <MuiButton
          variant="contained"
          color="secondary"
          onClick={handleExtend}
          disabled={status !== 'occupied'}
        >
          30分延長
        </MuiButton>
        <MuiButton
          variant="contained"
          onClick={handleUpdate}
        >
          登録・更新
        </MuiButton>
        <MuiButton
          variant="outlined"
          onClick={() => navigate('/')}
        >
          座席表に戻る
        </MuiButton>
      </Box>
    </Paper>
  );
}

