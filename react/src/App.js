import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Container, CssBaseline } from '@mui/material';
import Header from './components/Header';
import MyPage from './pages/MyPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import TableSet from './pages/TableSet';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import { ContactPage } from './pages/ContactPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CssBaseline />
        <Header />
        <Container component="main" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/table/:tableId" element={<TableSet />} />
              <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route path="/posts" element={<ContactPage />} />
              <Route path="/login/:userId" element={<LoginPage />} />
              <Route 
                path="/mypage/:userId"
                element={
                  <ProtectedRoute>
                    <MyPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
        </Container>
      </AuthProvider>
    </Router>
  );
}

export default App;