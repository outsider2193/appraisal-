import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import { toast, Bounce } from "react-toastify";
import API from "../../api/Axios";

const ResetPassword = () => {
    const { token } = useParams();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match", {
                position: "top-center",
                transition: Bounce,
                theme: "light"
            });
            return;
        }

        setLoading(true);
        try {
            const res = await API.post(`/auth/reset-password/${token}`, {
                password: data.password,
            });
            toast.success(res.data.message, {
                position: "top-center",
                transition: Bounce,
                theme: "light"
            });
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Reset failed", {
                position: "top-center",
                transition: Bounce,
                theme: "light"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Reset Password
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                            }
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) =>
                                value === watch("password") || "Passwords do not match",
                        })}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        sx={{ mb: 2 }}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default ResetPassword;
