import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Paper, Typography, CircularProgress, Alert, Button, Box, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField
} from '@mui/material';
import { API_BASE_URL } from '../config';
import AuthContext from '../context/AuthContext';

export default function MyPage() {
  const { userId } = useParams(); //URLからuserIdを取得
  const { authToken } = useContext(AuthContext); //providerで囲まれているなかで使用されていればauthTokenが取得できる

  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [activeBreak, setActiveBreak] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeRole, setActiveRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
//Callbackフック、パフォーマンスを最適化するためのもの。依存している値が変わらない限り再作成しない
  const getAuthHeaders = useCallback(() => ({
    headers: { 'Authorization': `Bearer ${authToken.access}` }
  }), [authToken]);


  const fetchAttendanceHistory = useCallback((employeeId) => {
    axios.get(`${API_BASE_URL}/employees/attendances/?employee_profile=${employeeId}`, getAuthHeaders())
      .then(res => setHistory(res.data))
      .catch(err => console.error("勤怠履歴の取得に失敗:", err));
  }, [getAuthHeaders]);

  const fetchLatestAttendance = useCallback((employeeId) => {
    axios.get(`${API_BASE_URL}/employees/attendances/?employee_profile=${employeeId}&latest=true`, getAuthHeaders())
      .then(res => {
        if (res.data && res.data.length > 0) {
          const latest = res.data[0];
          setAttendance(latest);
          const openBreak = latest.breaks?.find(b => b.break_end === null);
          setActiveBreak(openBreak || null);
          const openRole = latest.role_activities?.find(r => r.end_time === null);
          setActiveRole(openRole || null);
        } else {
          setAttendance(null);
          setActiveBreak(null);
          setActiveRole(null);
        }
      })
      .catch(err => {
        if (err.response?.status !== 404) setError('勤怠データの取得に失敗しました。');
      });
  }, [getAuthHeaders]);

  const refreshAttendanceData = useCallback(() => {
    if (employee?.id) {
        fetchLatestAttendance(employee.id);
        fetchAttendanceHistory(employee.id);
    }
  }, [employee, fetchLatestAttendance, fetchAttendanceHistory]);

  useEffect(() => {
    if (!authToken) {
      setError('認証が必要です。');
      setLoading(false);
      return;
    }
    console.log("MyPage useEffect triggered for userId:", userId); // Debug log
    axios.get(`${API_BASE_URL}/employees/employeeprofiles/?employee_number=${userId}`, getAuthHeaders())
      .then(res => {
        if (res.data && res.data.length > 0) {
          const empData = res.data[0];
          console.log("Fetched employee data:", empData); // Debug log
          setEmployee(empData);
          fetchLatestAttendance(empData.id);
          fetchAttendanceHistory(empData.id);
        } else {
          setError('該当する従業員が見つかりませんでした。');
        }
      })
      .catch(err => setError('データの取得に失敗しました。'))
      .finally(() => setLoading(false));
  }, [userId, authToken, getAuthHeaders, fetchLatestAttendance, fetchAttendanceHistory]);

  const handleClockIn = () => axios.post(`${API_BASE_URL}/employees/attendances/`, { employee: employee.id }, getAuthHeaders()).then(refreshAttendanceData).catch(err => alert("出勤処理に失敗しました。"));
  const handleClockOut = () => axios.patch(`${API_BASE_URL}/employees/attendances/${attendance.id}/`, { check_out: new Date().toISOString() }, getAuthHeaders()).then(refreshAttendanceData).catch(err => alert("退勤処理に失敗しました。"));
  const handleStartBreak = () => axios.post(`${API_BASE_URL}/employees/breaks/`, { attendance: attendance.id, break_start: new Date().toISOString() }, getAuthHeaders()).then(refreshAttendanceData).catch(err => alert("休憩開始処理に失敗しました。"));
  const handleEndBreak = () => axios.patch(`${API_BASE_URL}/employees/breaks/${activeBreak.id}/`, { break_end: new Date().toISOString() }, getAuthHeaders()).then(refreshAttendanceData).catch(err => alert("休憩終了処理に失敗しました。"));
  
  const handleSummaryChange = (attendanceId, summary) => {
    axios.patch(`${API_BASE_URL}/employees/attendances/${attendanceId}/`, { summary }, getAuthHeaders())
      .catch(err => alert("摘要の更新に失敗しました。"));
  };

  const handleStartRole = (role) => {
    const payload = { attendance: attendance.id, role: role, start_time: new Date().toISOString() };
    axios.post(`${API_BASE_URL}/employees/roleactivities/`, payload, getAuthHeaders())
      .then(refreshAttendanceData)
      .catch(err => {
        console.error("役割の開始処理でエラー:", err.response || err);
        alert("役割の開始処理に失敗しました。");
      });
  };

  const handleEndRole = () => {
    axios.patch(`${API_BASE_URL}/employees/roleactivities/${activeRole.id}/`, { end_time: new Date().toISOString() }, getAuthHeaders())
      .then(refreshAttendanceData)
      .catch(err => {
        console.error("役割の終了処理でエラー:", err.response || err);
        alert("役割の終了処理に失敗しました。");
      });
  };

  // 【修正点】時刻がない場合にN/Aではなく空白を返すように変更
  const formatDateTime = (isoString) => isoString ? new Date(isoString).toLocaleString('ja-JP') : '';
  
  const calculateTotalBreak = (breaks) => {
    const totalMs = breaks?.reduce((total, b) => b.break_start && b.break_end ? total + (new Date(b.break_end) - new Date(b.break_start)) : total, 0) || 0;
    return `${Math.floor(totalMs / 60000)}分`;
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

  const isClockedIn = attendance && !attendance.check_out;
  const isOnBreak = isClockedIn && !!activeBreak;
  const hasActiveRole = isClockedIn && !!activeRole;

  return (
    <Paper sx={{ p: 3, m: 2, maxWidth: 800, margin: '20px auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>マイページ</Typography>
      {employee?.user && (
        <>
          <Typography variant="h6">ようこそ、{employee.user.last_name} {employee.user.first_name} さん</Typography>
          <Typography sx={{ mt: 1, color: 'text.secondary' }}>従業員番号: {employee.employee_number}</Typography>
          
          <Box sx={{ mt: 4, p: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
             <Typography variant="h6" align="center" gutterBottom>
               現在のステータス: {isOnBreak ? '休憩中' : hasActiveRole ? `${activeRole.role === 'kitchen' ? 'キッチン' : 'ホール'}で作業中` : isClockedIn ? '出勤中 (待機)' : '退勤'}
             </Typography>
            <Grid container spacing={2} justifyContent="center">
              {!isClockedIn && (<Grid xs={12}><Button fullWidth variant="contained" color="primary" onClick={handleClockIn}>出勤</Button></Grid>)}
              {isClockedIn && !isOnBreak && (<><Grid xs={6}><Button fullWidth variant="contained" color="secondary" onClick={handleStartBreak}>休憩開始</Button></Grid><Grid xs={6}><Button fullWidth variant="outlined" color="error" onClick={handleClockOut}>退勤</Button></Grid></>)}
              {isOnBreak && (<Grid xs={12}><Button fullWidth variant="contained" color="success" onClick={handleEndBreak}>休憩終了</Button></Grid>)}
            </Grid>
          </Box>
          
          {isClockedIn && !isOnBreak && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
              <Typography variant="h6" align="center" gutterBottom>役割管理</Typography>
              <Grid container spacing={2} justifyContent="center">
                {!hasActiveRole ? (
                  <>
                    <Grid xs={6}><Button fullWidth variant="contained" onClick={() => handleStartRole('kitchen')}>キッチン開始</Button></Grid>
                    <Grid xs={6}><Button fullWidth variant="contained" onClick={() => handleStartRole('hall')}>ホール開始</Button></Grid>
                  </>
                ) : (
                  <Grid xs={12}><Button fullWidth variant="outlined" color="warning" onClick={handleEndRole}>役割終了</Button></Grid>
                )}
              </Grid>
            </Box>
          )}

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>勤怠履歴</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead><TableRow><TableCell>出勤</TableCell><TableCell>退勤</TableCell><TableCell align="right">休憩時間</TableCell><TableCell>摘要</TableCell></TableRow></TableHead>
                <TableBody>
                  {history.length > 0 ? history.map(record => (
                    <TableRow key={record.id}>
                      <TableCell>{formatDateTime(record.check_in)}</TableCell>
                      <TableCell>{formatDateTime(record.check_out)}</TableCell>
                      <TableCell align="right">{calculateTotalBreak(record.breaks)}</TableCell>
                      <TableCell>
                        <TextField 
                          variant="standard"
                          fullWidth
                          defaultValue={record.summary || ''}
                          onBlur={(e) => handleSummaryChange(record.id, e.target.value)}
                          InputProps={{ disableUnderline: true }}
                        />
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={4} align="center">履歴はありません</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}
    </Paper>
  );
}

