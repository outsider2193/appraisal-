import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as ScrollLink } from 'react-scroll';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" color="default" elevation={2}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="bold" sx={{ cursor: "pointer" }}>
          <ScrollLink to="home" smooth={true} duration={500} offset={-70}>
            Appraisal Tracker
          </ScrollLink>
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <ScrollLink to="goal-setting" smooth={true} duration={500} offset={-70}>
            <Button color="inherit">Goal Setting</Button>
          </ScrollLink>
          <ScrollLink to="multi-level-review" smooth={true} duration={500} offset={-70}>
            <Button color="inherit">Multi-Level Review</Button>
          </ScrollLink>
          <ScrollLink to="progress-feedback" smooth={true} duration={500} offset={-70}>
            <Button color="inherit">Progress & Feedback</Button>
          </ScrollLink>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" color="primary" onClick={() => navigate('/register')}>
            Sign Up
          </Button>
          <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
