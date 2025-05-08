import React from 'react'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import API from "../../api/Axios";

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);



    const submitHandler = async (data) => {
        setLoading(true);
        try {
            const res = await API.post("/auth/login", data);
            const token = res.data?.token || res.data?.message?.token;
            // const user = res.data?.user || res.data?.message?.user;

            if (token) {
                localStorage.setItem("token", token);
                const decoded = jwtDecode(token);
                const userRole = decoded.role;
                const userId = decoded.id;
                console.log(token);
                console.log(userRole);
                console.log(userId);

                // 🔁 Navigate based on role
                if (userRole === "employee") {
                    navigate(`/employee/dashboard/${userId}`);
                } else if (userRole === "hr") {
                    navigate(`/hr/dashboard/${userId}`);
                } else if (userRole === "manager") {
                    navigate(`/manager/dashboard/${userId}`);
                } else {
                    navigate("/register"); // fallback
                }

                toast.success("Successfully logged in!", {
                    position: "top-center",
                    autoClose: 5000,
                    theme: "light",
                    transition: Bounce,
                });
            } else {
                toast.error("No token received from server", {
                    position: "top-center",
                    theme: "light",
                    transition: Bounce,
                });
            }
        } catch (error) {
            console.error(error)
            toast.error("Login failed. Please check your credentials.", {
                position: "top-center",
                theme: "light",
                transition: Bounce,
            });
        } finally {
            setLoading(false);
        }
    };

    const validations = {
        emailValidation: {
            required: {
                value: true,
                message: "Email is required"
            },
            pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Email is invalid"
            }
        },
        passwordValidation: {
            required: {
                value: true,
                message: "Password is required"
            },
            minLength: {
                value: 6,
                message: "Password should be at least 6 characters long"
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                    Login
                </Typography>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        {...register("email", validations.emailValidation)}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        {...register("password", validations.passwordValidation)}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        sx={{ mb: 2 }}
                    />

                    {/* 🔗 Forgot Password Link */}
                    <Typography variant="body2" sx={{ textAlign: "right", mb: 2 }}>
                        <Link to="/forgot-password" style={{ textDecoration: "none", color: "#1976d2" }}>
                            Forgot Password?
                        </Link>
                    </Typography>

                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                    <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </Typography>
                </form>
            </Box>
        </Container>
    );
}

export default LoginPage
