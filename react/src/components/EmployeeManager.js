import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Box, Button, Paper, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog, DialogActions,
    DialogContent, DialogTitle, TextField, Select, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL } from '../config';

const EmployeeDialog = ({ open, onClose, onSave, profile }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (profile) {
            setFormData({
                employee_number: profile.employee_number || '',
                first_name: profile.user?.first_name || '',
                last_name: profile.user?.last_name || '',
                password: ''
            });
        } else {
            setFormData({ employee_number: '', first_name: '', last_name: '', password: '' });
        }
    }, [profile, open]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        const dataToSave = {
            employee_number: formData.employee_number,
            user: {
                first_name: formData.first_name,
                last_name: formData.last_name,
            }
        };
        if (!profile) { // Only add password for new users
            dataToSave.user.password = formData.password;
        }
        onSave(dataToSave);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{profile ? '従業員の編集' : '従業員の追加'}</DialogTitle>
            <DialogContent>
                <TextField name="employee_number" label="従業員番号" value={formData.employee_number} onChange={handleChange} fullWidth margin="dense" />
                <TextField name="first_name" label="名" value={formData.first_name} onChange={handleChange} fullWidth margin="dense" />
                <TextField name="last_name" label="姓" value={formData.last_name} onChange={handleChange} fullWidth margin="dense" />
                {!profile && <TextField name="password" label="パスワード" type="password" onChange={handleChange} fullWidth margin="dense" />}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>キャンセル</Button>
                <Button onClick={handleSave}>保存</Button>
            </DialogActions>
        </Dialog>
    );
};

export default function EmployeeManager() {
    const [profiles, setProfiles] = useState([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [currentProfile, setCurrentProfile] = useState(null);
    const [profileToDelete, setProfileToDelete] = useState(null);

    const fetchProfiles = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/employees/employeeprofiles/`);
            setProfiles(response.data);
        } catch (error) {
            console.error("Failed to fetch profiles:", error);
        }
    }, []);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    const apiRequest = async (method, url, data = null) => {
        try {
            await axios({ method, url, data });
            fetchProfiles();
        } catch (error) {
            console.error(`Failed to ${method} profile:`, error.response || error);
            alert(`プロファイルの${method}処理に失敗しました。`);
        }
    };

    const handleSave = async (data) => {
        const url = currentProfile
            ? `${API_BASE_URL}/employees/employeeprofiles/${currentProfile.id}/`
            : `${API_BASE_URL}/employees/employeeprofiles/`;
        const method = currentProfile ? 'put' : 'post';
        await apiRequest(method, url, data);
        setDialogOpen(false);
        setCurrentProfile(null);
    };

    const handleDelete = async () => {
        await apiRequest('delete', `${API_BASE_URL}/employees/employeeprofiles/${profileToDelete.id}/`);
        setConfirmOpen(false);
        setProfileToDelete(null);
    };

    const handleRoleChange = (profileId, newRole) => {
        apiRequest('post', `${API_BASE_URL}/employees/employeeprofiles/${profileId}/change_role/`, { role: newRole });
    };

    return (
        <Paper elevation={2} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">従業員一覧</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setCurrentProfile(null); setDialogOpen(true); }}>
                    従業員を追加
                </Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>従業員番号</TableCell>
                            <TableCell>氏名</TableCell>
                            <TableCell>現在の持ち場</TableCell>
                            <TableCell align="right">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {profiles.map(profile => (
                            <TableRow key={profile.id}>
                                <TableCell>{profile.employee_number}</TableCell>
                                <TableCell>{`${profile.user?.last_name || ''} ${profile.user?.first_name || ''}`}</TableCell>
                                <TableCell>
                                    <Select
                                        size="small"
                                        variant="standard"
                                        value={profile.current_role ? (profile.current_role === 'キッチン' ? 'kitchen' : 'hall') : ''}
                                        onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                                        disabled={!profile.hp} // Disable if not clocked in
                                    >
                                        <MenuItem value="kitchen">キッチン</MenuItem>
                                        <MenuItem value="hall">ホール</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => { setCurrentProfile(profile); setDialogOpen(true); }}><EditIcon /></IconButton>
                                    <IconButton onClick={() => { setProfileToDelete(profile); setConfirmOpen(true); }}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <EmployeeDialog open={isDialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} profile={currentProfile} />
            <Dialog open={isConfirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>削除の確認</DialogTitle>

                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>キャンセル</Button>
                    <Button onClick={handleDelete} color="error">削除</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}