import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';


export default function RollButton() {

    const [selected, setSelected] = useState('キッチン');
  return (

        <ButtonGroup>
            {/* 選択状態に応じてvariantを動的に変更 */}
            <Button 
                variant={selected === 'キッチン' ? 'contained' : 'outlined'}
                onClick={() => setSelected('キッチン')}
            >
                キッチン
            </Button>
            <Button 
                variant={selected === 'ホール' ? 'contained' : 'outlined'}
                onClick={() => setSelected('ホール')}
            >
                ホール
            </Button>
        </ButtonGroup>

  );
}