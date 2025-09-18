import React, { useState } from 'react';
import EmpList from "../components/EmpList";
import TablesStatus from "../components/TablesStatus";
import StickyNoteBoard from "../components/StickyNoteBoard";
import TodoListOpen from '../components/TodoListOpen';
import TodoListClose from '../components/TodoListClose';
import { Box } from '@mui/material';

const initialOpenTasks = {
  'トイレ清掃': false,
  'ガスの補充': false,
  'フロア清掃': false,
  '肉の仕込み': false,
  '音楽の再生': false,
};

const initialCloseTasks = {
  '鎮火チェック': false,
  '材料棚卸': false,
  'ドリンク注文': false,
  'フロア清掃': false,
  '電気系統OFF': false,
};

export default function HomePage() {
    const [showTodoList, setShowTodoList] = useState(false);
    const [showCloseTodoList, setShowCloseTodoList] = useState(false);
    const [openTasks, setOpenTasks] = useState(initialOpenTasks);
    const [closeTasks, setCloseTasks] = useState(initialCloseTasks);

    const toggleTodoList = () => {
        setShowTodoList(prev => !prev);
        setShowCloseTodoList(false);
    };

    const toggleCloseTodoList = () => {
        setShowCloseTodoList(prev => !prev);
        setShowTodoList(false);
    };

    const handleOpenTaskChange = (taskName) => {
        setOpenTasks(prev => ({ ...prev, [taskName]: !prev[taskName] }));
    };

    const handleCloseTaskChange = (taskName) => {
        setCloseTasks(prev => ({ ...prev, [taskName]: !prev[taskName] }));
    };

    return(
        <>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                    {showTodoList && 
                        <TodoListOpen 
                            tasks={openTasks} 
                            onTaskChange={handleOpenTaskChange} 
                        />
                    }
                    {showCloseTodoList && 
                        <TodoListClose 
                            tasks={closeTasks} 
                            onTaskChange={handleCloseTaskChange} 
                        />
                    }
                    <TablesStatus />
                </Box>
                <StickyNoteBoard onOpenTasksClick={toggleTodoList} onCloseTasksClick={toggleCloseTodoList} />
            </Box>
            <EmpList />
        </>
    );
}