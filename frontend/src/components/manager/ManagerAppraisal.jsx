import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    Stack,
} from '@mui/material';
import API from '../../api/Axios';

const ManagerAppraisal = () => {
    const [appraisals, setAppraisals] = useState([]);

    useEffect(() => {
        const fetchAppraisals = async () => {
            try {
                const response = await API.get('/manager/getappraisal');
                setAppraisals(response.data.appraisals);
            } catch (error) {
                console.error('Error fetching appraisals:', error);
            }
        };

        fetchAppraisals();
    }, []);

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Appraisal History
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {appraisals.map((appraisal) => {
                    const { employee, selfReview, managerReview } = appraisal;

                    return (
                        <Box key={appraisal._id} sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
                            <Card sx={{ minHeight: 300, display: 'flex', flexDirection: 'column' }}>
                                <CardContent>
                                    <Typography variant="h6">
                                        {employee.firstname} {employee.lastname}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {employee.email}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="subtitle1">Self Review</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {selfReview?.comment || 'Not submitted'}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle1">Manager Review</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {managerReview?.comment || 'Not submitted'}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default ManagerAppraisal;
