'use client';

import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import SavingsProjection from '@/components/SavingsProjection';
import { SavingsGoal } from '@/types/savings';

export default function ProjectionPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        Projeksiyon Tablosu
      </Typography>

      <SavingsProjection goals={goals} />
    </Box>
  );
} 