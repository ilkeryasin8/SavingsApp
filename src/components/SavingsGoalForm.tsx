'use client';

import { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, InputAdornment } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
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
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 3,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper'
      }}
    >
      <Typography variant="h6" gutterBottom color="text.primary">
        Yeni Tasarruf Hedefi
      </Typography>
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap'
        }}
      >
        <TextField
          label="Hedef Adı"
          placeholder="Örn: Araba, Ev, Tatil"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <TextField
          label="Hedef Miktar"
          type="number"
          placeholder="100000"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          required
          fullWidth
          InputProps={{
            endAdornment: <InputAdornment position="end">TL</InputAdornment>,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={<AddIcon />}
          fullWidth
          sx={{
            height: 56,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          Hedef Ekle
        </Button>
      </Box>
    </Paper>
  );
} 