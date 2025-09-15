import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
// ↓ BrowserRouterのインポートは不要になります
// import { BrowserRouter } from 'react-router'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* ↓ App.js側でRouterを管理しているため、ここは削除します */}
    {/* <BrowserRouter> */}
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    {/* </BrowserRouter> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
