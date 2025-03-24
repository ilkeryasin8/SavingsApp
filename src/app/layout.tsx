'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { Box, AppBar, Toolbar, Typography, Container, List, ListItemButton, ListItemIcon, ListItemText, Drawer, ThemeProvider, createTheme } from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Savings as SavingsIcon,
  TableChart as TableChartIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

const drawerWidth = 240;

// Özel tema oluşturma
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#7c3aed',
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

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, href: '/' },
  { text: 'Birikim Hedeflerim', icon: <SavingsIcon />, href: '/goals' },
  { text: 'Projeksiyon', icon: <TableChartIcon />, href: '/projection' },
  { text: 'İstatistikler', icon: <BarChartIcon />, href: '/stats' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="tr">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <Toolbar>
                <SavingsIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
                  Savings App
                </Typography>
              </Toolbar>
            </AppBar>
            <Drawer
              variant="permanent"
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  boxSizing: 'border-box',
                  borderRight: '1px solid',
                  borderColor: 'divider',
                },
              }}
            >
              <Toolbar />
              <List sx={{ mt: 2 }}>
                {menuItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <ListItemButton 
                      selected={pathname === item.href}
                      sx={{ 
                        mb: 1,
                        mx: 1,
                        borderRadius: 2,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                          '& .MuiListItemIcon-root': {
                            color: 'white',
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: pathname === item.href ? 'white' : 'primary.main' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: pathname === item.href ? 600 : 400,
                        }}
                      />
                    </ListItemButton>
                  </Link>
                ))}
              </List>
            </Drawer>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                backgroundColor: 'background.default',
                marginTop: '64px',
              }}
            >
              <Container maxWidth="lg">
                {children}
              </Container>
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
