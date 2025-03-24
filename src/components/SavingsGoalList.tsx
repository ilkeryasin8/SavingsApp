'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Paper,
  Typography,
  LinearProgress,
  Box,
  IconButton,
  TextField,
  Chip,
  Slider,
  InputAdornment,
  List,
  ListItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { SavingsGoal } from '@/types/savings';
import { debounce } from 'lodash';

interface SavingsGoalListProps {
  goals: SavingsGoal[];
  onUpdateAmount: (id: string, amount: number) => void;
  onUpdatePercentage: (id: string, percentage: number) => void;
}

interface GoalWithEstimates {
  id: string;
  completionDate: string | null;
  monthsToComplete: number;
}

export default function SavingsGoalList({ goals, onUpdateAmount, onUpdatePercentage }: SavingsGoalListProps) {
  const [amountInputs, setAmountInputs] = React.useState<{ [key: string]: string }>({});
  const [estimates, setEstimates] = useState<{ [key: string]: GoalWithEstimates }>({});
  const [sliderValues, setSliderValues] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const newEstimates: { [key: string]: GoalWithEstimates } = {};
    goals.forEach((goal) => {
      const remainingAmount = goal.targetAmount - goal.currentAmount;
      const monthsToComplete = goal.monthlyAmount > 0 ? Math.ceil(remainingAmount / goal.monthlyAmount) : 0;
      
      let completionDate = null;
      if (monthsToComplete > 0) {
        const date = new Date();
        date.setMonth(date.getMonth() + monthsToComplete);
        completionDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      }

      newEstimates[goal.id] = {
        id: goal.id,
        completionDate,
        monthsToComplete,
      };
    });
    setEstimates(newEstimates);
  }, [goals]);

  useEffect(() => {
    const initialValues: { [key: string]: number } = {};
    goals.forEach((goal) => {
      initialValues[goal.id] = goal.monthlyPercentage;
    });
    setSliderValues(initialValues);
  }, [goals]);

  const debouncedUpdatePercentage = useCallback(
    debounce((id: string, value: number) => {
      onUpdatePercentage(id, value);
    }, 500),
    [onUpdatePercentage]
  );

  const handleSliderChange = (id: string, value: number) => {
    setSliderValues(prev => ({ ...prev, [id]: value }));
    debouncedUpdatePercentage(id, value);
  };

  const handleAmountChange = (id: string, value: string) => {
    setAmountInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleAddAmount = (id: string) => {
    const amount = Number(amountInputs[id]);
    if (!isNaN(amount) && amount > 0) {
      onUpdateAmount(id, amount);
      setAmountInputs(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent, id: string) => {
    if (event.key === 'Enter') {
      handleAddAmount(id);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (goals.length === 0) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          p: 4,
          textAlign: 'center',
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Henüz Hedef Eklenmemiş
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Yeni bir tasarruf hedefi ekleyerek başlayın
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        mt: 3,
      }}
    >
      <List sx={{ p: 0 }}>
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remainingAmount = goal.targetAmount - goal.currentAmount;
          const isCompleted = progress >= 100;
          const estimate = estimates[goal.id];

          return (
            <ListItem
              key={goal.id}
              sx={{
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: 2,
                p: 3,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': { 
                  borderBottom: 'none',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    {goal.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Hedef: ${goal.targetAmount.toLocaleString('tr-TR')} TL`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      label={`Mevcut: ${goal.currentAmount.toLocaleString('tr-TR')} TL`}
                      color="secondary"
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      label={`Aylık: ${goal.monthlyAmount.toLocaleString('tr-TR')} TL`}
                      color="info"
                      variant="outlined"
                      size="small"
                    />
                    {isCompleted && (
                      <Chip 
                        label="Tamamlandı" 
                        color="success"
                        size="small"
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    İlerleme: %{Math.round(progress)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Kalan: {remainingAmount.toLocaleString('tr-TR')} TL
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(progress, 100)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      backgroundColor: isCompleted ? 'success.main' : 'primary.main',
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Dağıtım Yüzdesi: %{sliderValues[goal.id] || goal.monthlyPercentage}
                  </Typography>
                  <Slider
                    value={sliderValues[goal.id] || goal.monthlyPercentage}
                    onChange={(_, value) => handleSliderChange(goal.id, value as number)}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `%${value}`}
                    sx={{
                      color: isCompleted ? 'success.main' : 'primary.main',
                      '& .MuiSlider-thumb': {
                        height: 20,
                        width: 20,
                        backgroundColor: '#fff',
                        border: '2px solid currentColor',
                        '&:hover, &.Mui-focusVisible': {
                          boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)',
                        },
                      },
                      '& .MuiSlider-track': {
                        height: 6,
                        borderRadius: 3,
                      },
                      '& .MuiSlider-rail': {
                        height: 6,
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, minWidth: 200 }}>
                  <TextField
                    size="small"
                    type="number"
                    value={amountInputs[goal.id] || ''}
                    onChange={(e) => handleAmountChange(goal.id, e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, goal.id)}
                    placeholder="Miktar"
                    fullWidth
                    InputProps={{
                      endAdornment: <InputAdornment position="end">TL</InputAdornment>,
                    }}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => handleAddAmount(goal.id)}
                    disabled={!amountInputs[goal.id] || Number(amountInputs[goal.id]) <= 0}
                    sx={{ 
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>

              {estimate?.monthsToComplete > 0 && !isCompleted && estimate.completionDate && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    p: 1,
                    borderRadius: 1,
                    textAlign: 'center',
                  }}
                >
                  Tahmini tamamlanma: {formatDate(estimate.completionDate)}
                </Typography>
              )}
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
} 