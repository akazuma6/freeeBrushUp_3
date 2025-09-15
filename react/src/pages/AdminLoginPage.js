import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';

const AdminLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (username && password) {
            const user = await loginUser(username, password);
            if (user && user.is_staff) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            alert("従業員番号とパスワードを入力してください。");
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h5" component="h1" gutterBottom align="center">
                    管理者ログイン
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="従業員番号"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        name="username"
                        autoFocus
                    />
                    <TextField
                        label="パスワード"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.5 }}>
                        ログイン
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default AdminLoginPage;
