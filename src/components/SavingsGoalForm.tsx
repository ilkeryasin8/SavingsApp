'use client';

import { useState } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import { SavingsGoal } from '@/types/savings';

interface SavingsGoalFormProps {
  onAddGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'createdAt' | 'monthlyPercentage' | 'monthlyAmount'>) => void;
}

export default function SavingsGoalForm({ onAddGoal }: SavingsGoalFormProps) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && targetAmount) {
      onAddGoal({
        name,
        targetAmount: Number(targetAmount),
      });
      setName('');
      setTargetAmount('');
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Yeni Tasarruf Hedefi Ekle
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Hedef Adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          sx={{ flexGrow: 1, minWidth: '200px' }}
        />
        <TextField
          label="Hedef Miktar (TL)"
          type="number"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          required
          sx={{ flexGrow: 1, minWidth: '200px' }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ minWidth: '150px', height: '56px' }}
        >
          Hedef Ekle
        </Button>
      </Box>
    </Paper>
  );
} 