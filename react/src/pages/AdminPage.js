import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import EmployeeManager from '../components/EmployeeManager';



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>管理者設定</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="admin tabs">
          <Tab label="従業員管理" id="admin-tab-0" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <EmployeeManager />
      </TabPanel>
      
    </Box>
  );
}