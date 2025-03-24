'use client';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { SavingsGoal } from '@/types/savings';

interface SavingsProjectionProps {
  goals: SavingsGoal[];
}

export default function SavingsProjection({ goals }: SavingsProjectionProps) {
  // Gelecek 12 ay için projeksiyon oluştur
  const projections = Array.from({ length: 12 }, (_, monthIndex) => {
    const date = new Date();
    date.setMonth(date.getMonth() + monthIndex + 1);

    const monthProjections = goals.map(goal => {
      const projectedAmount = goal.currentAmount + (goal.monthlyAmount * (monthIndex + 1));
      const isComplete = projectedAmount >= goal.targetAmount;
      return {
        ...goal,
        projectedAmount: isComplete ? goal.targetAmount : projectedAmount,
        isComplete,
      };
    });

    return {
      date,
      goals: monthProjections,
    };
  });

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        12 Aylık Projeksiyon
      </Typography>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Tarih</TableCell>
              {goals.map((goal) => (
                <TableCell key={goal.id} align="right">
                  {goal.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {projections.map((projection) => (
              <TableRow key={projection.date.toISOString()}>
                <TableCell component="th" scope="row">
                  {projection.date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                </TableCell>
                {projection.goals.map((goal) => (
                  <TableCell
                    key={goal.id}
                    align="right"
                    sx={{
                      color: goal.isComplete ? 'success.main' : 'inherit',
                      fontWeight: goal.isComplete ? 'bold' : 'inherit',
                    }}
                  >
                    {goal.projectedAmount.toLocaleString('tr-TR')} TL
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
} 