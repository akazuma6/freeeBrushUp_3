import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import dayjs from 'dayjs';
import { API_BASE_URL } from '../config';

export default function TableSet() {
  const { tableId } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('available');
  const [people, setPeople] = useState('');
  const [entryTime, setEntryTime] = useState(dayjs());
  const [memo, setMemo] = useState('');
  const [extensionMinutes, setExtensionMinutes] = useState(0);

  const fetchTableData = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tables/${tableId}/`);
      const data = response.data;
      setStatus(data.status || 'available');
      setPeople(data.people || '');
      setEntryTime(data.entryTime ? dayjs(data.entryTime) : dayjs());
      setMemo(data.memo || '');
      setExtensionMinutes(data.extension_minutes || 0);
    } catch (error) {
      console.error("Failed to fetch table data:", error);
    }
  }, [tableId]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  const makeApiRequest = async (payload, options = {}) => {
    const { navigateHome = false, alertMessage = null } = options;
    try {
      await axios.patch(`${API_BASE_URL}/tables/${tableId}/`, payload);
      if (alertMessage) alert(alertMessage);
      if (navigateHome) {
        navigate('/');
      } else {
        fetchTableData(); // Refresh data if not navigating away
      }
    } catch (error) {
      console.error("API request failed:", error);
      alert("操作に失敗しました。");
    }
  };

  const handleUpdate = () => {
    const payload = {
      status,
      people: people === '' ? null : Number(people),
      entryTime: entryTime.toISOString(),
      memo,
    };
    makeApiRequest(payload, { navigateHome: true });
  };

  const handleExit = () => {
    const payload = {
      status: 'available',
      people: null,
      entryTime: null,
      exitTime: new Date().toISOString(),
      memo: '',
      extension_minutes: 0,
    };
    makeApiRequest(payload, { navigateHome: true });
  };

  const handleExtend = () => {
    const newExtensionTime = extensionMinutes + 30;
    makeApiRequest({ extension_minutes: newExtensionTime }, { alertMessage: '30分延長しました。' });
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, margin: 'auto' }} elevation={3}>
      <Typography variant="h4" gutterBottom>
        {tableId}卓の管理
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


      <Box sx={{ mt: 4, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <MuiButton
          variant="outlined"
          color="error"
          onClick={handleExit}
          disabled={status !== 'occupied'}
        >
          退席
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
          登録
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

