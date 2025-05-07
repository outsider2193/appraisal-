import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  Toolbar,
  CssBaseline,
} from '@mui/material';

import Overview from './Overview';
import CreateAppraisal from './CreateAppraisal';
import Employees from './Employees';
import Managers from './Managers';
import AllAppraisals from './AllAppraisals';
import HRReviewForm from './HRReviewForm';

const drawerWidth = 240;

const HrSidebar = () => {
  const [selectedComponent, setSelectedComponent] = useState('overview');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'overview':
        return <Overview />;
      case 'create':
        return <CreateAppraisal />;
      case 'employees':
        return <Employees />;
      case 'managers':
        return <Managers />;
      case 'all':
        return <AllAppraisals />;
      case 'review':
        return <HRReviewForm />;
      default:
        return <Overview />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Fixed Permanent Sidebar */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f0f0f0',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <Typography variant="h6" align="center" mt={2} fontWeight="bold">
            HR Dashboard
          </Typography>
          <List>
            <ListItem button onClick={() => setSelectedComponent('overview')}>
              <ListItemText primary="Overview" />
            </ListItem>
            <ListItem button onClick={() => setSelectedComponent('create')}>
              <ListItemText primary="Create Appraisal" />
            </ListItem>
            <ListItem button onClick={() => setSelectedComponent('employees')}>
              <ListItemText primary="Employees" />
            </ListItem>
            <ListItem button onClick={() => setSelectedComponent('managers')}>
              <ListItemText primary="Managers" />
            </ListItem>
            <ListItem button onClick={() => setSelectedComponent('all')}>
              <ListItemText primary="All Appraisals" />
            </ListItem>
            <ListItem button onClick={() => setSelectedComponent('review')}>
              <ListItemText primary="HR Review Form" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: `${drawerWidth}px`, // offset for fixed sidebar
        }}
      >
        <Toolbar />
        {renderComponent()}
      </Box>
    </Box>
  );
};

export default HrSidebar;
