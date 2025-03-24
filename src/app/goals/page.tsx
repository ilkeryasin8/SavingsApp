'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Paper } from '@mui/material';
import SavingsGoalForm from '@/components/SavingsGoalForm';
import SavingsGoalList from '@/components/SavingsGoalList';
import { SavingsGoal } from '@/types/savings';

export default function GoalsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hedefleri yükle
  useEffect(() => {
    fetchGoals();
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

  // Aylık toplam değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('monthlyTotal', monthlyTotal);
  }, [monthlyTotal]);

  const handleAddGoal = async (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'createdAt' | 'monthlyPercentage' | 'monthlyAmount'>) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goal),
      });

      if (!response.ok) throw new Error('Failed to create goal');

      const newGoal = await response.json();
      setGoals((prev) => [...prev, newGoal]);
    } catch (err) {
      setError('Hedef eklenirken bir hata oluştu');
      console.error('Error creating goal:', err);
    }
  };

  const handleUpdateAmount = async (id: string, amount: number) => {
    try {
      const goal = goals.find(g => g.id === id);
      if (!goal) return;

      const updatedGoal = {
        ...goal,
        currentAmount: goal.currentAmount + amount,
      };

      const response = await fetch(`/api/goals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGoal),
      });

      if (!response.ok) throw new Error('Failed to update goal');

      const data = await response.json();
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? data : g))
      );
    } catch (err) {
      setError('Hedef güncellenirken bir hata oluştu');
      console.error('Error updating goal:', err);
    }
  };

  const handleUpdatePercentage = async (id: string, percentage: number) => {
    try {
      const goal = goals.find(g => g.id === id);
      if (!goal) return;

      const monthlyAmount = (Number(monthlyTotal) * percentage) / 100;
      const updatedGoal = {
        ...goal,
        monthlyPercentage: percentage,
        monthlyAmount,
      };

      const response = await fetch(`/api/goals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGoal),
      });

      if (!response.ok) throw new Error('Failed to update goal');

      const data = await response.json();
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? data : g))
      );
    } catch (err) {
      setError('Hedef güncellenirken bir hata oluştu');
      console.error('Error updating goal:', err);
    }
  };

  const totalPercentage = goals.reduce((sum, goal) => sum + goal.monthlyPercentage, 0);

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
        Birikim Hedeflerim
      </Typography>

      <Paper 
        elevation={0} 
        sx={{ 
          p: 3,
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Aylık Toplam Birikim
        </Typography>
        <TextField
          label="Aylık Birikim Miktarı (TL)"
          type="number"
          value={monthlyTotal}
          onChange={(e) => setMonthlyTotal(e.target.value)}
          fullWidth
          helperText={
            <Typography 
              variant="caption" 
              color={totalPercentage > 100 ? 'error' : 'text.secondary'}
            >
              Toplam Dağıtılan: %{totalPercentage}
            </Typography>
          }
          error={totalPercentage > 100}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      </Paper>

      <SavingsGoalForm onAddGoal={handleAddGoal} />
      <SavingsGoalList
        goals={goals}
        onUpdateAmount={handleUpdateAmount}
        onUpdatePercentage={handleUpdatePercentage}
      />
    </Box>
  );
} 