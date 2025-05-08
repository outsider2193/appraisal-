import React from "react";
import { useForm } from "react-hook-form";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import { toast, Bounce } from "react-toastify";
import API from "../../api/Axios";

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await API.post("/auth/forgot-password", data);
            toast.success(res.data.message, {
                position: "top-center",
                transition: Bounce,
                theme: "light"
            });
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong", {
                position: "top-center",
                transition: Bounce,
                theme: "light"
            });
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Forgot Password
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email"
                            }
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        sx={{ mb: 2 }}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Send Reset Link
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default ForgotPassword;
