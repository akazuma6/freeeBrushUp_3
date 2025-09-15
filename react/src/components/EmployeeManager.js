import React, { useState, useEffect } from 'react';
import {
    Box, Button, Paper, Typography, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, IconButton, Dialog, DialogActions, 
    DialogContent, DialogTitle, TextField, DialogContentText, Select, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

    const fetchProfiles = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/employees/employeeprofiles/');
            const data = await response.json();
            setProfiles(data);
        } catch (error) {
            console.error("Failed to fetch profiles:", error);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const handleSave = async (data) => {
        const url = currentProfile 
            ? `http://127.0.0.1:8000/api/employees/employeeprofiles/${currentProfile.id}/`
            : 'http://127.0.0.1:8000/api/employees/employeeprofiles/';
        const method = currentProfile ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                fetchProfiles();
            } else {
                const errorData = await response.json();
                console.error("Failed to save profile:", errorData);
            }
        } catch (error) {
            console.error("Failed to save profile:", error);
        }
        setDialogOpen(false);
        setCurrentProfile(null);
    };

    const handleDelete = async () => {
        try {
            await fetch(`http://127.0.0.1:8000/api/employees/employeeprofiles/${profileToDelete.id}/`, {
                method: 'DELETE'
            });
            fetchProfiles();
        } catch (error) {
            console.error("Failed to delete profile:", error);
        }
        setConfirmOpen(false);
        setProfileToDelete(null);
    };

    const handleRoleChange = async (profileId, newRole) => {
        try {
            await fetch(`http://127.0.0.1:8000/api/employees/employeeprofiles/${profileId}/change_role/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });
            fetchProfiles(); // Refresh data to show the new role
        } catch (error) {
            console.error("Failed to change role:", error);
        }
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
                <DialogContent>
                    <DialogContentText>
                        本当に従業員番号「{profileToDelete?.employee_number}」を削除しますか？この操作は元に戻せません。
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>キャンセル</Button>
                    <Button onClick={handleDelete} color="error">削除</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}