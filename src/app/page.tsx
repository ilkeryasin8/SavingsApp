'use client';

import { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, LinearProgress } from '@mui/material';
import { SavingsGoal } from '@/types/savings';

export default function Home() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState<string>('');

  useEffect(() => {
    const savedGoals = localStorage.getItem('savingsGoals');
    const savedMonthlyTotal = localStorage.getItem('monthlyTotal');
    
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals).map((goal: SavingsGoal) => ({
        ...goal,
        createdAt: new Date(goal.createdAt)
      }));
      setGoals(parsedGoals);
    }

    if (savedMonthlyTotal) {
      setMonthlyTotal(savedMonthlyTotal);
    }
  }, []);

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const sortedGoals = [...goals].sort((a, b) => {
    const progressA = (a.currentAmount / a.targetAmount) * 100;
    const progressB = (b.currentAmount / b.targetAmount) * 100;
    return progressB - progressA;
  });

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="text.primary" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Toplam İstatistikler */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Toplam Birikim
            </Typography>
            <Typography variant="h4" color="primary.main" gutterBottom>
              {totalSaved.toLocaleString('tr-TR')} TL
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Hedef: {totalTarget.toLocaleString('tr-TR')} TL
            </Typography>
            <Box sx={{ mt: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={totalProgress}
                sx={{ 
                  height: 8,
                  borderRadius: 4,
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Toplam İlerleme: %{Math.round(totalProgress)}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Aylık Birikim
            </Typography>
            <Typography variant="h4" color="secondary.main" gutterBottom>
              {Number(monthlyTotal).toLocaleString('tr-TR')} TL
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aktif Hedef Sayısı: {goals.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" gutterBottom>
              En Yakın Hedef
            </Typography>
            {sortedGoals.length > 0 ? (
              <>
                <Typography variant="h4" color="success.main" gutterBottom>
                  {sortedGoals[0].name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  İlerleme: %{Math.round((sortedGoals[0].currentAmount / sortedGoals[0].targetAmount) * 100)}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(sortedGoals[0].currentAmount / sortedGoals[0].targetAmount) * 100}
                    sx={{ 
                      height: 8,
                      borderRadius: 4,
                    }}
                  />
                </Box>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Henüz hedef eklenmemiş
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
