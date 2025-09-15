import React, { useState } from 'react';
import EmpList from "../components/EmpList";
import TablesStatus from "../components/TablesStatus";
import StickyNoteBoard from "../components/StickyNoteBoard";
import TodoListOpen from '../components/TodoListOpen';
import { Box } from '@mui/material';
import TodoListClose from '../components/TodoListClose';

export default function HomePage() {
    const [showTodoList, setShowTodoList] = useState(false);
    const [showCloseTodoList, setShowCloseTodoList] = useState(false);

    const toggleTodoList = () => {
        setShowTodoList(prev => !prev);
        setShowCloseTodoList(false); // OPEN作業リスト表示時はCLOSE作業リストを非表示
    };

    const toggleCloseTodoList = () => {
        setShowCloseTodoList(prev => !prev);
        setShowTodoList(false); // CLOSE作業リスト表示時はOPEN作業リストを非表示
    };

    const handleTodoListComplete = () => {
        setShowTodoList(false);
    };

    return(
        <>
        
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                    {showTodoList && <TodoListOpen onComplete={handleTodoListComplete} />}
                    {showCloseTodoList && <TodoListClose />}
                    <TablesStatus />
                </Box>
                <StickyNoteBoard onOpenTasksClick={toggleTodoList} onCloseTasksClick={toggleCloseTodoList} />
            </Box>
            <EmpList />
        </>
    );
}