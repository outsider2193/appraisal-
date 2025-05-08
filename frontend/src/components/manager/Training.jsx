import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    Stack,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    IconButton,
    Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import API from '../../api/Axios';

const Training = () => {
    const [appraisals, setAppraisals] = useState([]);
    const [trainingsData, setTrainingsData] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [trainingForm, setTrainingForm] = useState({
        title: '',
        description: '',
        type: 'online',
        startDate: '',
        completionDate: '',
    });

    const fetchAppraisals = async () => {
        try {
            const response = await API.get('/manager/getappraisal');
            setAppraisals(response.data.appraisals);
            return response.data.appraisals;
        } catch (error) {
            console.error('Error fetching appraisals:', error);
            return [];
        }
    };

    useEffect(() => {
        fetchAppraisals();
    }, []);

    const fetchTrainings = async (employeeList = appraisals) => {
        setRefreshing(true);
        const newTrainingsData = {};
        for (const appraisal of employeeList) {
            const employeeId = appraisal.employee._id;
            try {
                const response = await API.get(`/manager/fetchtrainings/${employeeId}`);
                newTrainingsData[employeeId] = response.data.trainings;
            } catch (error) {
                console.error(`Error fetching trainings for employee ${employeeId}:`, error);
                newTrainingsData[employeeId] = [];
            }
        }
        setTrainingsData(newTrainingsData);
        setRefreshing(false);
    };

    useEffect(() => {
        if (appraisals.length > 0) {
            fetchTrainings(appraisals);
        }
    }, [appraisals]);

    const handleRefresh = async () => {
        await fetchTrainings();
    };

    const handleOpenDialog = (employee) => {
        setSelectedEmployee(employee);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedEmployee(null);
        setTrainingForm({
            title: '',
            description: '',
            type: 'online',
            startDate: '',
            completionDate: '',
        });
    };

    const handleAssignTraining = async () => {
        if (!selectedEmployee) return;
        try {
            await API.post(`/manager/assigntraining/${selectedEmployee._id}`, trainingForm);
            const response = await API.get(`/manager/fetchtrainings/${selectedEmployee._id}`);
            setTrainingsData((prev) => ({
                ...prev,
                [selectedEmployee._id]: response.data.trainings,
            }));
            handleCloseDialog();
        } catch (error) {
            console.error('Error assigning training:', error);
        }
    };

    const handleRemoveTraining = async (employeeId, trainingId) => {
        try {
            await API.delete(`/manager/trainings/${trainingId}`);
            const response = await API.get(`/manager/fetchtrainings/${employeeId}`);
            setTrainingsData((prev) => ({
                ...prev,
                [employeeId]: response.data.trainings,
            }));
        } catch (error) {
            console.error('Error removing training:', error);
        }
    };

    // Remove duplicate employees based on their employee ID
    const uniqueAppraisals = Array.from(new Set(appraisals.map((appraisal) => appraisal.employee._id)))
        .map((id) => appraisals.find((appraisal) => appraisal.employee._id === id));

    return (
        <Box sx={{ padding: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Employee Trainings
                </Typography>
                <Tooltip title="Refresh training data">
                    <IconButton onClick={handleRefresh} disabled={refreshing}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {uniqueAppraisals.map((appraisal) => {
                    const employee = appraisal.employee;
                    const trainings = trainingsData[employee._id] || [];
                    const hasTraining = trainings.length > 0;

                    return (
                        <Box
                            key={employee._id}
                            sx={{ flex: '1 1 300px', maxWidth: '400px' }}
                        >
                            <Card sx={{ minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <CardContent>
                                    <Typography variant="h6">
                                        {employee.firstname} {employee.lastname}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {employee.email}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle1">Assigned Trainings:</Typography>
                                        {hasTraining ? (
                                            <Stack spacing={1} mt={1}>
                                                {trainings.map((training) => (
                                                    <Box
                                                        key={training._id}
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            border: '1px solid #ccc',
                                                            borderRadius: 1,
                                                            padding: 1,
                                                        }}
                                                    >
                                                        <Box>
                                                            <Typography variant="subtitle2">{training.title}</Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {training.description}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Type: {training.type}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                From: {new Date(training.startDate).toLocaleDateString()} - To: {new Date(training.completionDate).toLocaleDateString()}
                                                            </Typography>
                                                            <Chip 
                                                                label={training.status} 
                                                                size="small" 
                                                                sx={{ mt: 1 }}
                                                                color={training.status === 'completed' ? 'success' : 
                                                                       training.status === 'in_progress' ? 'primary' : 'default'}
                                                            />
                                                        </Box>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleRemoveTraining(employee._id, training._id)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" mt={1}>
                                                No trainings assigned.
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        onClick={() => handleOpenDialog(employee)}
                                    >
                                        Assign Training
                                    </Button>
                                </CardActions>
                            </Card>
                        </Box>
                    );
                })}
            </Box>

            {/* Assign Training Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Assign Training</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={trainingForm.title}
                        onChange={(e) => setTrainingForm({ ...trainingForm, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={trainingForm.description}
                        onChange={(e) => setTrainingForm({ ...trainingForm, description: e.target.value })}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={trainingForm.type}
                            onChange={(e) => setTrainingForm({ ...trainingForm, type: e.target.value })}
                            label="Type"
                        >
                            <MenuItem value="online">Online</MenuItem>
                            <MenuItem value="workshop">Workshop</MenuItem>
                            <MenuItem value="seminar">Seminar</MenuItem>
                            <MenuItem value="certification">Certification</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Start Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={trainingForm.startDate}
                        onChange={(e) => setTrainingForm({ ...trainingForm, startDate: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Completion Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={trainingForm.completionDate}
                        onChange={(e) => setTrainingForm({ ...trainingForm, completionDate: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleAssignTraining} variant="contained">
                        Assign
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Training;