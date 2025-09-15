import React, { useState, useEffect } from 'react';
import { Box, Checkbox, FormControlLabel, Paper, Typography } from '@mui/material';

const initialTasks = {
  '鎮火チェック': false,
  '材料棚卸': false,
  'ドリンク注文': false,
  'フロア清掃': false,
  '電気系統OFF': false,
};

const TODO_LIST_STORAGE_KEY = 'todo-list-state';

const TodoListClose = ({ onComplete }) => {
  const [tasks, setTasks] = useState(() => {
    try {
      const storedTasks = localStorage.getItem(TODO_LIST_STORAGE_KEY);
      return storedTasks ? JSON.parse(storedTasks) : initialTasks;
    } catch (error) {
      console.error("Failed to parse tasks from localStorage", error);
      return initialTasks;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(TODO_LIST_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage", error);
    }

    const allComplete = Object.values(tasks).every(Boolean);
    if (allComplete) {
        // Reset tasks for the next day
        localStorage.removeItem(TODO_LIST_STORAGE_KEY);
        onComplete();
    }
  }, [tasks, onComplete]);

  const handleTaskChange = (taskName) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [taskName]: !prevTasks[taskName],
    }));
  };

  return (
    <Paper sx={{ p: 2, width: '100%', height: 'auto' }} elevation={2}>
      <Typography variant="h6" gutterBottom>クローズ作業</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {Object.keys(tasks).map(taskName => (
          <FormControlLabel
            key={taskName}
            control={
              <Checkbox 
                checked={tasks[taskName]} 
                onChange={() => handleTaskChange(taskName)} 
              />
            }
            label={taskName}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default TodoListClose;
