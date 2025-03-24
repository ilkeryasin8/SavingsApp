'use client';

import { useState, useEffect } from 'react';
import { Container, Box, AppBar, Toolbar, Typography, TextField, Paper } from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import { v4 as uuidv4 } from 'uuid';
import SavingsGoalForm from '@/components/SavingsGoalForm';
import SavingsGoalList from '@/components/SavingsGoalList';
import SavingsProjection from '@/components/SavingsProjection';
import { SavingsGoal } from '@/types/savings';

export default function Home() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState<string>('');

  // LocalStorage'dan hedefleri yükleme
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

  // Hedefler veya aylık toplam değiştiğinde localStorage'a kaydetme
  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(goals));
    localStorage.setItem('monthlyTotal', monthlyTotal);
  }, [goals, monthlyTotal]);

  const handleAddGoal = (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'createdAt' | 'monthlyPercentage' | 'monthlyAmount'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: uuidv4(),
      currentAmount: 0,
      createdAt: new Date(),
      monthlyPercentage: 0, // Kullanıcı manuel olarak ayarlayacak
      monthlyAmount: 0
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const handleUpdateAmount = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? { ...goal, currentAmount: goal.currentAmount + amount }
          : goal
      )
    );
  };

  const handleUpdatePercentage = (id: string, percentage: number) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === id) {
          const monthlyAmount = (Number(monthlyTotal) * percentage) / 100;
          return { ...goal, monthlyPercentage: percentage, monthlyAmount };
        }
        return goal;
      })
    );
  };

  // Toplam yüzdeyi hesapla
  const totalPercentage = goals.reduce((sum, goal) => sum + goal.monthlyPercentage, 0);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <SavingsIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Savings App
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Aylık Toplam Birikim
          </Typography>
          <TextField
            label="Aylık Birikim Miktarı (TL)"
            type="number"
            value={monthlyTotal}
            onChange={(e) => setMonthlyTotal(e.target.value)}
            fullWidth
            helperText={`Toplam Dağıtılan: %${totalPercentage}`}
            error={totalPercentage > 100}
          />
        </Paper>

        <SavingsGoalForm onAddGoal={handleAddGoal} />
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <SavingsGoalList
              goals={goals}
              onUpdateAmount={handleUpdateAmount}
              onUpdatePercentage={handleUpdatePercentage}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <SavingsProjection goals={goals} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
