'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { SavingsGoal } from '@/types/savings';

export default function StatsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
    const savedMonthlyTotal = localStorage.getItem('monthlyTotal');
    if (savedMonthlyTotal) {
      setMonthlyTotal(savedMonthlyTotal);
    }
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals');
      if (!response.ok) throw new Error('Failed to fetch goals');
      const data = await response.json();
      setGoals(data);
    } catch (err) {
      setError('Hedefler yüklenirken bir hata oluştu');
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  // İstatistikleri hesapla
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  const averageProgress = goals.length > 0
    ? goals.reduce((sum, goal) => sum + ((goal.currentAmount / goal.targetAmount) * 100), 0) / goals.length
    : 0;
  const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;
  const monthlyTotalNum = Number(monthlyTotal);
  const estimatedMonthsToComplete = totalTarget > 0
    ? Math.ceil((totalTarget - totalSaved) / monthlyTotalNum)
    : 0;

  // En yüksek ve en düşük ilerleme
  const progressList = goals.map(goal => ({
    name: goal.name,
    progress: (goal.currentAmount / goal.targetAmount) * 100
  }));

  const highestProgress = progressList.length > 0
    ? progressList.reduce((max, curr) => curr.progress > max.progress ? curr : max)
    : null;

  const lowestProgress = progressList.length > 0
    ? progressList.reduce((min, curr) => curr.progress < min.progress ? curr : min)
    : null;

  if (loading) {
    return (
      <Box>
        <Typography>Yükleniyor...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="text.primary" sx={{ mb: 4 }}>
        İstatistikler
      </Typography>

      <Grid container spacing={3}>
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
              Genel Durum
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Toplam Hedef: {goals.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tamamlanan Hedef: {completedGoals}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Toplam Birikim: {totalSaved.toLocaleString('tr-TR')} TL
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Hedef: {totalTarget.toLocaleString('tr-TR')} TL
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
              İlerleme Durumu
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Ortalama İlerleme: %{Math.round(averageProgress)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Toplam İlerleme: %{Math.round(totalProgress)}
              </Typography>
              {highestProgress && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  En Yüksek İlerleme: {highestProgress.name} (%{Math.round(highestProgress.progress)})
                </Typography>
              )}
              {lowestProgress && (
                <Typography variant="body2" color="text.secondary">
                  En Düşük İlerleme: {lowestProgress.name} (%{Math.round(lowestProgress.progress)})
                </Typography>
              )}
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
              Tahminler
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Aylık Birikim: {Number(monthlyTotal).toLocaleString('tr-TR')} TL
              </Typography>
              {estimatedMonthsToComplete > 0 && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tahmini Tamamlanma: {estimatedMonthsToComplete} ay
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                Tamamlanma Oranı: %{Math.round((completedGoals / goals.length) * 100 || 0)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 