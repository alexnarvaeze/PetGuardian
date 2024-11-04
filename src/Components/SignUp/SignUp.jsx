import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import logo from "../Capital_One_logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

const API_URL = "http://localhost:5000/api"; // Hardcoded API URL

const SignUp = () => {
  const [signupFail, setSignupFail] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    retypePassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.retypePassword) {
      setSignupFail("Passwords must match!");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/auth/signup`, // Consistent usage of hardcoded API URL
        formData
      );
      if (response.status === 201) {
        localStorage.setItem("userToken", "");
        navigate("/Home", {
          state: {name: formData.name},
        });
      } else {
        setSignupFail("Signup failed");
      }
    } catch (error) {
      setSignupFail("Signup failed");
    }
  };

  return (
    <div className="body">
      <img src={logo} alt="Capital One Logo" className="login-logo" />
      <Box
        className="form-box"
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        {signupFail && <div className="error-message">{signupFail}</div>}
        <TextField
          id="name"
          label="Name"
          variant="outlined"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          id="outlined-username"
          label="Username"
          variant="outlined"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <TextField
          id="outlined-password"
          label="Password"
          variant="outlined"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          id="outlined-retype-password"
          label="Retype Password"
          variant="outlined"
          type="password"
          name="retypePassword"
          value={formData.retypePassword}
          onChange={handleChange}
        />
        <Button
          className="redirect"
          onClick={() => navigate("/login")}
          type="button"
        >
          Already have an account?
        </Button>
        <Button
          className="center-button"
          variant="contained"
          type="submit"
        >
          Sign Up
        </Button>
      </Box>
    </div>
  );
};

export default SignUp;