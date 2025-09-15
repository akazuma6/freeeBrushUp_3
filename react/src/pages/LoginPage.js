import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';

const LoginPage = () => {
    const { userId } = useParams();
    const [password, setPassword] = useState('');
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userId && password) {
            const user = await loginUser(userId, password);
            if (user) {
                navigate(`/mypage/${userId}`);
            }
        } else {
            alert("パスワードを入力してください。");
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h5" component="h1" gutterBottom align="center">
                    パスワードを入力
                </Typography>
                <Typography variant="h6" align="center" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
                    従業員番号: {userId}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="パスワード"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        autoFocus
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.5 }}>
                        ログイン
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default LoginPage;