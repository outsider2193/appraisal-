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

import ManagerOverview from './ManagerOverview';
import ReviewForm from './ReviewForm';
import ManagerAppraisal from './ManagerAppraisal';
import Goals from './Goals';
import Training from './Training';



const drawerWidth = 240;

const ManagerSidebar = () => {
    const [selectedComponent, setSelectedComponent] = useState('overview');

    const renderComponent = () => {
        switch (selectedComponent) {
            case 'overview':
                return <ManagerOverview />;

            case 'review':
                return <ReviewForm />;
            case 'appraisals':
                return <ManagerAppraisal />;
            case 'Employee Goals':
                return <Goals></Goals>
            case 'Employee Training':
                return <Training />
            default:
                return <ManagerOverview />;
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* Permanent Sidebar */}
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: '#f9f9f9',
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <Typography variant="h6" align="center" mt={2} fontWeight="bold">
                        Manager Panel
                    </Typography>
                    <List>
                        <ListItem button onClick={() => setSelectedComponent('overview')}>
                            <ListItemText primary="Overview" />
                        </ListItem>

                        <ListItem button onClick={() => setSelectedComponent('review')}>
                            <ListItemText primary="Review Form" />
                        </ListItem>
                        <ListItem button onClick={() => setSelectedComponent('appraisals')}>
                            <ListItemText primary="Appraisals" />
                        </ListItem>
                        <ListItem button onClick={() => setSelectedComponent('Employee Goals')}>
                            <ListItemText primary="Employee Goals" />
                        </ListItem>
                        <ListItem button onClick={() => setSelectedComponent('Employee Training')}>
                            <ListItemText primary="Employee Training" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    ml: `${drawerWidth}px`,
                }}
            >
                <Toolbar />
                {renderComponent()}
            </Box>
        </Box>
    );
};

export default ManagerSidebar
