
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';

import React, { useState, useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


import SvgIcon from '@mui/material/SvgIcon';
import { useNavigate } from 'react-router';
export default function Bar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  // 引数pathを受け取り、画面遷移を実行する
  const handleClose = (path) => {
    setAnchorEl(null); // まずメニューを閉じる
    
    // pathが文字列の場合のみ、そのページに遷移
    if (typeof path === 'string') {
      navigate(path);
    }
  };
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <Box sx={{ flexGrow: 1, mb: 2 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          {/* MenuIconとドロップダウンメニュー */}
          <IconButton
        align="left"
        aria-label="menu"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color="inherit"
        >
            <MenuIcon />
          </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl} 
          open={open} 
          onClose={handleClose} 
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={() => handleClose('/posts')}>お問い合わせ</MenuItem> {/*お客さんのアレルギー、割引とか口頭に合わせてさらに供給*/}
          <MenuItem onClick={() => handleClose('/admin-login')}>管理者設定</MenuItem> {/*従業員jsonデータの追加、削除*/}
          <MenuItem onClick={() => handleClose('/reservations')}>予約管理</MenuItem>
          <MenuItem onClick={() => handleClose('/history')}>付箋履歴</MenuItem>
        </Menu>
          
          {/* ホームアイコンのリンク */}
          <IconButton          
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 1 }}
            onClick={() => handleClose('/')}
          >
            <HomeIcon />
          </IconButton>

          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
            Flex Board
          </Typography>

          <Typography variant="h6" color="inherit" component="div">
            {time.toLocaleTimeString()}
          </Typography>

          
        </Toolbar>
      </AppBar>
    </Box>
  );
}