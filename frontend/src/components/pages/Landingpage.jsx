import React from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent, Icon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { AccessAlarm, TrackChanges, People, VerifiedUser, Feedback, EmojiEvents, SelfImprovement, SupervisorAccount, Approval, CheckCircle, Update, StarBorder } from '@mui/icons-material';
import backgroundImage from "../../assets/images/BGWelcome.jpg";

const Landingpage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <Box
        id="home"
        sx={{
          minHeight: '100vh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          p: 4
        }}
      >
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
            Welcome to the Appraisal Tracker
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Streamline your organization's employee performance evaluations
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/login')} sx={{ mr: 2 }}>
            Login
          </Button>
          <Button variant="outlined" color="inherit" onClick={() => navigate('/register')}>
            Register
          </Button>
        </Box>
      </Box>

      {/* Goal Setting Section */}
      <Box id="goal-setting" sx={{ py: 8, backgroundColor: '#f4f6f8' }}>
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
            Goal Setting
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Card elevation={3} sx={{ backgroundColor: '#d3e3fc' }}>
                <CardContent>
                  <Icon sx={{ fontSize: 40, color: '#1976d2' }}><AccessAlarm /></Icon>
                  <Typography variant="h6" gutterBottom>
                    Set Smart Goals
                  </Typography>
                  <Typography variant="body2">
                    Employees can define, manage, and align their goals with organizational objectives ensuring transparency and clarity.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card elevation={3} sx={{ backgroundColor: '#f7d9c2' }}>
                <CardContent>
                  <Icon sx={{ fontSize: 40, color: '#f57c00' }}><TrackChanges /></Icon>
                  <Typography variant="h6" gutterBottom>
                    Track Progress
                  </Typography>
                  <Typography variant="body2">
                    Monitor ongoing performance and ensure milestones are met with timely updates.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card elevation={3} sx={{ backgroundColor: '#a5d6a7' }}>
                <CardContent>
                  <Icon sx={{ fontSize: 40, color: '#388e3c' }}><People /></Icon>
                  <Typography variant="h6" gutterBottom>
                    Collaborative Objectives
                  </Typography>
                  <Typography variant="body2">
                    Facilitate goal alignment between employees and supervisors for enhanced teamwork.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card elevation={3} sx={{ backgroundColor: '#ffccbc' }}>
                <CardContent>
                  <Icon sx={{ fontSize: 40, color: '#f44336' }}><VerifiedUser /></Icon>
                  <Typography variant="h6" gutterBottom>
                    Verified Achievements
                  </Typography>
                  <Typography variant="body2">
                    Ensure that each achievement is verified for accuracy and trustworthiness.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Multi-Level Review Section */}
      <Box id="multi-level-review" sx={{ py: 8, backgroundColor: '#fff' }}>
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
            Multi-Level Review
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Card elevation={3} sx={{ backgroundColor: '#e3f2fd' }}>
                <CardContent>
                  <Icon sx={{ fontSize: 40, color: '#1e88e5' }}><SelfImprovement /></Icon>
                  <Typography variant="h6" gutterBottom>
                    Self Evaluation
                  </Typography>
                  <Typography variant="body2">
                    Let employees evaluate their own performance for self-awareness and accountability.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card elevation={3} sx={{ backgroundColor: '#ffe0b2' }}>
                <CardContent>
                  <Icon sx={{ fontSize: 40, color: '#ff5722' }}><SupervisorAccount /></Icon>
                  <Typography variant="h6" gutterBottom>
                    Supervisor Review
                  </Typography>
                  <Typography variant="body2">
                    Managers can give structured feedback on employee performance.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card elevation={3} sx={{ backgroundColor: '#c8e6c9' }}>
                <CardContent>
                  <Icon sx={{ fontSize: 40, color: '#388e3c' }}><Approval /></Icon>
                  <Typography variant="h6" gutterBottom>
                    Final Approval
                  </Typography>
                  <Typography variant="body2">
                    HR ensures final verification and fair appraisal processes.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card elevation={3} sx={{ backgroundColor: '#d1c4e9' }}>
                <CardContent>
                  <Icon sx={{ fontSize: 40, color: '#673ab7' }}><CheckCircle /></Icon>
                  <Typography variant="h6" gutterBottom>
                    Approval Workflow
                  </Typography>
                  <Typography variant="body2">
                    Streamline the entire approval process to ensure timely performance reviews.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Progress and Feedback Section */}
      <Box id="progress-feedback" sx={{ py: 8, backgroundColor: '#f4f6f8' }}>
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
            Progress & Feedback
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Card elevation={3} sx={{ backgroundColor: '#c8e6c9' }}>
                <CardContent>
                  <Icon sx={{ fontSize: 40, color: '#388e3c' }}><Update /></Icon>
                  <Typography variant="h6" gutterBottom>
                    Real-Time Updates
                  </Typography>
                  <Typography variant="body2">
                    Track performance metrics and get timely alerts on progress.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card elevation={3} sx={{ backgroundColor: '#e1bee7' }}>
                <CardContent>
                  <Icon sx={{ fontSize: 40, color: '#9c27b0' }}><Feedback /></Icon>
                  <Typography variant="h6" gutterBottom>
                    360° Feedback
                  </Typography>
                  <Typography variant="body2">
                    Collect feedback from peers, subordinates, and supervisors.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card elevation={3} sx={{ backgroundColor: '#ffccbc' }}>
                <CardContent>
                  <Icon sx={{ fontSize: 40, color: '#ff5722' }}><EmojiEvents /></Icon>
                  <Typography variant="h6" gutterBottom>
                    Recognize Achievements
                  </Typography>
                  <Typography variant="body2">
                    Highlight accomplishments and motivate with recognition tools.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card elevation={3} sx={{ backgroundColor: '#f7d9c2' }}>
                <CardContent>
                  <Icon sx={{ fontSize: 40, color: '#f57c00' }}><StarBorder /></Icon>
                  <Typography variant="h6" gutterBottom>
                    Performance Ratings
                  </Typography>
                  <Typography variant="body2">
                    Rate employee performance based on clear criteria and provide detailed feedback.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Landingpage;
