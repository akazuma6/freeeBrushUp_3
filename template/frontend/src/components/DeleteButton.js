// frontend/src/components/DeleteButton.js

import React from 'react';
import Button from '@mui/material/Button';

// 親コンポーネントから postId と onDelete を propsとして受け取る
function DeleteButton({ postId, onDelete }) {
  // このコンポーネントはaxiosやuseStateを知る必要がない
  // ただ渡された関数を、渡されたIDで実行するだけ

  return (
    <Button sx={{ backgroundColor: 'primary.main', color: 'white' }} variant="contained" onClick={() => onDelete(postId)} className="delete-btn">
      Delete
    </Button>
  );
}

export default DeleteButton;