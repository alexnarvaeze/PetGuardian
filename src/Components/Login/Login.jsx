import React, { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import logo from "../images/PetGuardian_Logo.jpg";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loginFail, setLoginFail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const fetchUserData = async (token) => {
  //   try {
  //     const response = await axios.get(
  //        `${API_URL}/auth/signup`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     console.log("Fetched user data:", response.data);
  //     navigate("/Home", {
  //       state: {
  //         name: response.data.name,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Failed to fetch user data:", error);
  //     setLoginFail("Failed to load user data");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      if (response.status === 200) {
        // Assuming we receive a token or user data on successful login
        localStorage.setItem("userToken", "Login"); // Modify according to your needs
        navigate("/Home");
      } else {
        setLoginFail("Login failed");
      }
    } catch (error) {
      setLoginFail(error.response?.data.message || "Login failed");
    }
  };
  return (
    <div className="body">
      <img src={logo} alt="PetGuardian Logo" className="login-logo" />
      <Box
        className="form-box"
        component="form"
        sx={{ "& > :not(style)": { m: 1, width: "40ch" } }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        {loginFail && <div className="error-message">{loginFail}</div>}
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
        <Button
          className="redirect"
          onClick={() => {
            navigate("/signup");
          }}
          type="button"
        >
          <span>{"Don't have an account?"}</span>
        </Button>
        <Button
          className="center-button"
          sx={{
            backgroundColor: "rgb(71,140,209)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgb(0,72,120)",
            },
          }}
          variant="contained"
          type="submit"
        >
          Sign In
        </Button>
      </Box>
    </div>
  );
};

export default Login;
