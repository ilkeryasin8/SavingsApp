'use client';

import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  LinearProgress,
  Box,
  IconButton,
  TextField,
  Chip,
  Slider,
  InputAdornment,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { SavingsGoal } from '@/types/savings';
import { useState } from 'react';

interface SavingsGoalListProps {
  goals: SavingsGoal[];
  onUpdateAmount: (id: string, amount: number) => void;
  onUpdatePercentage: (id: string, percentage: number) => void;
}

export default function SavingsGoalList({ goals, onUpdateAmount, onUpdatePercentage }: SavingsGoalListProps) {
  const [amounts, setAmounts] = useState<{ [key: string]: string }>({});

  const handleAddAmount = (id: string) => {
    const amount = amounts[id];
    if (amount) {
      onUpdateAmount(id, Number(amount));
      setAmounts((prev) => ({ ...prev, [id]: '' }));
    }
  };

  if (goals.length === 0) {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          textAlign: 'center'
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
        backgroundColor: 'background.paper'
      }}
    >
      <List sx={{ p: 0 }}>
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remainingAmount = goal.targetAmount - goal.currentAmount;
          const monthsToComplete = goal.monthlyAmount > 0 ? Math.ceil(remainingAmount / goal.monthlyAmount) : 0;
          const completionDate = new Date();
          completionDate.setMonth(completionDate.getMonth() + monthsToComplete);

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
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Dağıtım Yüzdesi: %{goal.monthlyPercentage}
                </Typography>
                <Slider
                  value={goal.monthlyPercentage}
                  onChange={(_, value) => onUpdatePercentage(goal.id, value as number)}
                  min={0}
                  max={100}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `%${value}`}
                  sx={{
                    '& .MuiSlider-thumb': {
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0 0 0 8px rgba(37, 99, 235, 0.16)',
                      },
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  label="Miktar Ekle"
                  type="number"
                  value={amounts[goal.id] || ''}
                  onChange={(e) => setAmounts((prev) => ({ ...prev, [goal.id]: e.target.value }))}
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
                <IconButton
                  color="primary"
                  onClick={() => handleAddAmount(goal.id)}
                  disabled={!amounts[goal.id]}
                  sx={{ 
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    width: 40,
                    height: 40,
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Box>

              {monthsToComplete > 0 && (
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
                  Tahmini tamamlanma: {completionDate.toLocaleDateString('tr-TR')}
                </Typography>
              )}
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
} 