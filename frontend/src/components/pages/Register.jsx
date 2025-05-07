import React from 'react'
import { useForm } from "react-hook-form";
import { Box, Button, Grid, TextField, Typography, MenuItem, Paper, Container } from "@mui/material";
import API from "../../api/Axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from 'react-router-dom';


const roles = ["employee", "manager", "hr"];
const genders = ["Male", "Female", "Other"];

const Register = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await API.post("/auth/signup", data);
            console.log(response.data)
            toast.success("Registration successful!");
            navigate("/login");
            reset();

        } catch (error) {
            if (error.response?.data?.message && error.status === 400) {
                toast.error("User already exists");
            }
            else {
                toast.error("Registration failed");
            }
        }
    };

    const validations = {
        nameValidation: {
            required: { value: true, message: "First name is required" },
            minLength: { value: 2, message: "Name must be at least 2 characters" },
        },
        lastNameValidation: {
            required: { value: true, message: "Last name is required" },
        },
        emailValidation: {
            required: { value: true, message: "Email is required" },
            pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Email is invalid",
            },
        },
        passwordValidation: {
            required: { value: true, message: "Password is required" },
            minLength: { value: 6, message: "Password should be at least 6 characters" },
        },
        contactValidation: {
            required: { value: true, message: "Contact number is required" },
            pattern: {
                value: /^[0-9]{10}$/,
                message: "Contact number must be 10 digits",
            },
        },
    };

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 5,
                        borderRadius: 3,
                        width: "100%",
                        maxWidth: 800,
                    }}
                >
                    <Typography
                        variant="h4"
                        align="center"
                        fontWeight="bold"
                        fontFamily="Roboto"
                        gutterBottom
                    >
                        Register
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Box display="flex" gap={2} mb={2}>
                            <TextField
                                label="First Name"
                                fullWidth
                                {...register("firstName", validations.nameValidation)}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                            <TextField
                                label="Last Name"
                                fullWidth
                                {...register("lastName", validations.lastNameValidation)}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                        </Box>

                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                {...register("email", validations.emailValidation)}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />

                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                {...register("password", validations.passwordValidation)}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />

                            <Box display="flex" gap={2}>
                                <TextField
                                    select
                                    label="Gender"
                                    fullWidth
                                    {...register("gender", { required: "Gender is required" })}
                                    error={!!errors.gender}
                                    helperText={errors.gender?.message}
                                    defaultValue=""
                                >
                                    {genders.map((gender) => (
                                        <MenuItem key={gender} value={gender}>
                                            {gender}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    label="Contact Number"
                                    fullWidth
                                    {...register("contactNumber", validations.contactValidation)}
                                    error={!!errors.contactNumber}
                                    helperText={errors.contactNumber?.message}
                                />
                            </Box>

                            <Box display="flex" gap={2}>
                                <TextField
                                    label="Department"
                                    fullWidth
                                    {...register("department", { required: "Department is required" })}
                                    error={!!errors.department}
                                    helperText={errors.department?.message}
                                />

                                <TextField
                                    label="Designation"
                                    fullWidth
                                    {...register("designation", { required: "Designation is required" })}
                                    error={!!errors.designation}
                                    helperText={errors.designation?.message}
                                />
                            </Box>

                            <TextField
                                select
                                label="Role"
                                fullWidth
                                {...register("role", { required: "Role is required" })}
                                error={!!errors.role}
                                helperText={errors.role?.message}
                                defaultValue=""
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                size="large"
                                sx={{ mt: 1 }}
                            >
                                Register
                            </Button>

                            <Typography align="center" sx={{ mt: 2 }}>
                                Already have an account?{" "}
                                <Link to="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
                                    Login here
                                </Link>
                            </Typography>
                        </Box>
                    </form>

                </Paper>
            </Box>
        </Container>
    );
}

export default Register
