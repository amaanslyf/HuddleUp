import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Import MUI components
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';

// Import pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoomPage from './pages/RoomPage';

// Import ProtectedRoute component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Navigation Bar using MUI AppBar */}
        <AppBar position="static">
          <Toolbar>
            {/* Brand Name */}
            <Typography 
              variant="h6" 
              component={Link} 
              to="/" 
              sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
            >
              HuddleUp
            </Typography>
            
            {/* Navigation Links */}
            <Box>
              {isAuthenticated ? (
                <>
                  <span style={{ marginRight: '1rem' }}>Welcome, {user?.username}!</span>
                  <Button color="inherit" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>
                  <Button color="inherit" component={Link} to="/register">
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content Area */}
        <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/room/:roomId" 
              element={
                <ProtectedRoute>
                  <RoomPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
