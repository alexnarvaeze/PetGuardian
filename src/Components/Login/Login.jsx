import React, { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import logo from "../Capital_One_logo.png";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const ADDRESS = process.env.REACT_APP_CURR_ADDRESS;

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

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(
        `http://${ADDRESS}:8005/api/auth/user-data`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetched user data:", response.data);
      navigate("/Home", {
        state: {
          name: response.data.name,
          budget: response.data.budget,
          totalExpenses: response.data.totalExpenses,
          groceryExpenses: response.data.groceryExpenses,
          billsExpenses: response.data.billsExpenses,
          subscriptionExpenses: response.data.subscriptionExpenses,
          gasExpenses: response.data.gasExpenses,
          otherExpenses: response.data.otherExpenses,
          savings: response.data.savings,
        },
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setLoginFail("Failed to load user data");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://${ADDRESS}:8005/api/auth/login`,
        formData
      );
      if (response.data.message === "Login successful!") {
        localStorage.setItem("userToken", response.data.token);
        console.log("Login success!");
        fetchUserData(response.data.token);
      } else {
        setLoginFail("Login Failed: " + response.data.message);
      }
    } catch (error) {
      const errorMessage = "Login failed";
      setLoginFail(errorMessage);
    }
  };

  return (
    <div className="body">
      <img src={logo} alt="Capital One Logo" className="login-logo" />
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
