'use client';

import { useState, useEffect } from 'react';
import { Container, Box, AppBar, Toolbar, Typography } from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import { v4 as uuidv4 } from 'uuid';
import SavingsGoalForm from '@/components/SavingsGoalForm';
import SavingsGoalList from '@/components/SavingsGoalList';
import { SavingsGoal } from '@/types/savings';

const calculateInitialPercentage = (targetAmount: number): number => {
  // Hedef miktara göre başlangıç yüzdesi belirleme
  if (targetAmount <= 1000) return 20;
  if (targetAmount <= 5000) return 15;
  if (targetAmount <= 10000) return 12;
  if (targetAmount <= 50000) return 10;
  if (targetAmount <= 100000) return 8;
  return 5;
};

export default function Home() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);

  // LocalStorage'dan hedefleri yükleme
  useEffect(() => {
    const savedGoals = localStorage.getItem('savingsGoals');
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals).map((goal: SavingsGoal) => ({
        ...goal,
        createdAt: new Date(goal.createdAt)
      }));
      setGoals(parsedGoals);
    }
  }, []);

  // Hedefler değiştiğinde localStorage'a kaydetme
  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'createdAt' | 'monthlyPercentage'>) => {
    const monthlyPercentage = calculateInitialPercentage(goal.targetAmount);
    const newGoal: SavingsGoal = {
      ...goal,
      id: uuidv4(),
      currentAmount: 0,
      createdAt: new Date(),
      monthlyPercentage
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
        <SavingsGoalForm onAddGoal={handleAddGoal} />
        <SavingsGoalList goals={goals} onUpdateAmount={handleUpdateAmount} />
      </Container>
    </Box>
  );
}
