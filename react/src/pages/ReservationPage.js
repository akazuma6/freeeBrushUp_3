import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';

const tables = [
  { id: 1, name: 'テーブル1' },
  { id: 2, name: 'テーブル2' },
  { id: 3, name: 'テーブル3' },
  { id: 4, name: 'テーブル4' },
  { id: 5, name: 'テーブル5' },
  { id: 6, name: 'テーブル6' },
];

const generateTimeSlots = () => {
  const slots = [];
  for (let i = 17; i < 24; i++) {
    slots.push(`${i}:00`);
    slots.push(`${i}:30`);
  }
  for (let i = 0; i < 4; i++) {
    slots.push(`0${i}:00`);
    slots.push(`0${i}:30`);
  }
  return slots;
};
const timeSlots = generateTimeSlots();
const SLOT_WIDTH = 80; // in pixels

const CurrentTimeIndicator = ({ tableHeaderRef }) => {
    const [position, setPosition] = useState(0);

    useEffect(() => {
        const updatePosition = () => {
            const now = new Date();
            let hour = now.getHours();
            const minute = now.getMinutes();

            if (hour < 17 && hour >= 4) {
                setPosition(-1); // Hide indicator if outside business hours
                return;
            }

            const firstSlotHour = 17;
            let hourDifference = hour - firstSlotHour;
            if(hour < firstSlotHour) { // next day
                hourDifference = hour + (24 - firstSlotHour);
            }

            const totalMinutes = hourDifference * 60 + minute;
            const newPosition = (totalMinutes / 30) * SLOT_WIDTH;

            if (tableHeaderRef.current) {
                const headerLeft = tableHeaderRef.current.getBoundingClientRect().left;
                setPosition(headerLeft + newPosition);
            }
        };

        updatePosition();
        const interval = setInterval(updatePosition, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [tableHeaderRef]);

    if (position < 0) return null;

    return (
        <Box
            sx={{
                position: 'absolute',
                left: `${position}px`,
                top: 0,
                bottom: 0,
                width: '2px',
                backgroundColor: 'red',
                zIndex: 10, // Ensure it's above the table cells
            }}
        />
    );
};

function ReservationPage() {
  const tableHeaderRef = useRef(null);
  const reservations = {}; // No logic, so no reservations

  return (
    <div style={{ position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          予約管理
        </Typography>
        <Typography variant="h6" component="p">
          {new Date().toLocaleDateString('ja-JP')}
        </Typography>
      </Box>
      <Paper>
        <TableContainer sx={{ maxHeight: 800 }}>
          <Table stickyHeader aria-label="reservation timeline">
            <TableHead>
              <TableRow>
                <TableCell ref={tableHeaderRef} sx={{ minWidth: 100, borderRight: 1, borderColor: 'divider' }}>テーブル</TableCell>
                {timeSlots.map((time) => (
                  <TableCell key={time} align="center" sx={{ minWidth: SLOT_WIDTH, maxWidth: SLOT_WIDTH, borderRight: 1, borderColor: 'divider' }}>{time}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1, borderColor: 'divider' }}>
                    {table.name}
                  </TableCell>
                  {timeSlots.map((time) => {
                    const reservation = reservations[`${table.name}-${time}`];
                    return (
                      <TableCell
                        key={`${table.name}-${time}`}
                        align="center"
                        sx={{
                          borderRight: 1,
                          borderColor: 'divider',
                          backgroundColor: 'inherit',
                          color: 'inherit',
                        }}
                      >
                        {reservation && (
                          <Box>
                            <Typography variant="caption">{reservation.name}</Typography>
                            <Typography variant="caption" display="block">({reservation.number_of_people}名)</Typography>
                          </Box>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <CurrentTimeIndicator tableHeaderRef={tableHeaderRef} />
        </TableContainer>
      </Paper>
    </div>
  );
}

export default ReservationPage;