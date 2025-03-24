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
  Box,
} from '@mui/material';
import { SavingsGoal } from '@/types/savings';

interface SavingsProjectionProps {
  goals: SavingsGoal[];
}

export default function SavingsProjection({ goals }: SavingsProjectionProps) {
  if (goals.length === 0) {
    return null;
  }

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
    <Paper 
      elevation={0} 
      sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper'
      }}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" color="text.primary">
          12 Aylık Projeksiyon
        </Typography>
      </Box>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  backgroundColor: 'background.paper',
                  fontWeight: 600,
                }}
              >
                Tarih
              </TableCell>
              {goals.map((goal) => (
                <TableCell 
                  key={goal.id} 
                  align="right"
                  sx={{ 
                    backgroundColor: 'background.paper',
                    fontWeight: 600,
                  }}
                >
                  {goal.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {projections.map((projection) => (
              <TableRow 
                key={projection.date.toISOString()}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <TableCell 
                  component="th" 
                  scope="row"
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500,
                  }}
                >
                  {projection.date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                </TableCell>
                {projection.goals.map((goal) => (
                  <TableCell
                    key={goal.id}
                    align="right"
                    sx={{
                      color: goal.isComplete ? 'success.main' : 'text.primary',
                      fontWeight: goal.isComplete ? 600 : 400,
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