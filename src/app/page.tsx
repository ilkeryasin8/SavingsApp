'use client';

import { useState, useEffect } from 'react';
import { Container, Box, AppBar, Toolbar, Typography, TextField, Paper, useTheme, ThemeProvider, createTheme } from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import { v4 as uuidv4 } from 'uuid';
import SavingsGoalForm from '@/components/SavingsGoalForm';
import SavingsGoalList from '@/components/SavingsGoalList';
import SavingsProjection from '@/components/SavingsProjection';
import { SavingsGoal } from '@/types/savings';

// Özel tema oluşturma
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Modern mavi
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#7c3aed', // Modern mor
      light: '#a78bfa',
      dark: '#5b21b6',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1e293b',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

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
      monthlyPercentage: 0,
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

  const totalPercentage = goals.reduce((sum, goal) => sum + goal.monthlyPercentage, 0);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: 'background.default',
        pb: 4
      }}>
        <AppBar position="sticky" elevation={0}>
          <Toolbar>
            <SavingsIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
              Savings App
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ mt: 4 }}>
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

          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
            <Box sx={{ flex: 1 }}>
              <SavingsGoalForm onAddGoal={handleAddGoal} />
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
    </ThemeProvider>
  );
}
