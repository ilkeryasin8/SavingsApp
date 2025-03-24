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

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Tasarruf Hedefleriniz
      </Typography>
      <List>
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
                gap: 1,
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                '&:last-child': { borderBottom: 'none' },
                py: 2,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <ListItemText
                    primary={goal.name}
                    secondary={`Hedef: ${goal.targetAmount.toLocaleString('tr-TR')} TL`}
                  />
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={`Aylık: ${goal.monthlyAmount.toLocaleString('tr-TR')} TL`}
                      color="primary"
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`Kalan: ${remainingAmount.toLocaleString('tr-TR')} TL`}
                      color="secondary"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  {`${goal.currentAmount.toLocaleString('tr-TR')} TL`}
                </Typography>
              </Box>

              <Box sx={{ px: 1 }}>
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
                />
              </Box>

              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 8, borderRadius: 4 }}
              />

              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <TextField
                  size="small"
                  label="Miktar Ekle (TL)"
                  type="number"
                  value={amounts[goal.id] || ''}
                  onChange={(e) => setAmounts((prev) => ({ ...prev, [goal.id]: e.target.value }))}
                  sx={{ flexGrow: 1 }}
                />
                <IconButton
                  color="primary"
                  onClick={() => handleAddAmount(goal.id)}
                  disabled={!amounts[goal.id]}
                >
                  <AddIcon />
                </IconButton>
              </Box>

              {monthsToComplete > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
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