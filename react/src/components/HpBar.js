import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, LinearProgress, Box, Typography
} from '@mui/material';
import LoginButton from './LoginButton';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/employees/employeeprofiles/`;

// HPバーを表示するコンポーネント
const HpBar = ({ value }) => {
  if (value === null || typeof value === 'undefined') return null;
  const normalizedValue = Math.max(0, Math.min(10, value)) * 10;
  const barColor = normalizedValue > 50 ? 'primary' : normalizedValue > 20 ? 'warning' : 'error';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={normalizedValue} color={barColor} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(value * 10) / 10}`}</Typography>
      </Box>
    </Box>
  );
};

export default HpBar