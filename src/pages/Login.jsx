import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/Styles/StyledComponent";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth.js";
import { usernameValidator } from "../utils/validators";
import myImage from  "../../public/myImage.jpg"
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");
  const avatar = useFileHandler("single");
  const dispatch = useDispatch();

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging In...");
    setIsLoading(true);
    const config = { withCredentials: true, headers: { "Content-Type": "application/json" } };
    try {
      const { data } = await axios.post(`${server}/user/login`, { username: username.value, password: password.value }, config);
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || `Something Went Wrong ${error}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);
    const config = { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } };
    try {
      const { data } = await axios.post(`${server}/user/new`, formData, config);
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || `Something Went Wrong ${error}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
   
    style={{ 
      backgroundImage: `url(${myImage})`, 
      backgroundSize: 'cover',
      minHeight: '100vh',
      backgroundRepeat:"no-repeat"
  }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: "4px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background:"transparent",
            border: "2px solid rgba(255,255,255,0.2)",
            backdropFilter:"blur(20px)",
            boxShadow:"0 0 10px rgba(0,0,0,0.2)"
          }}
             
        >
          {isLogin ? (
            <LoginForm
              handleLogin={handleLogin}
              toggleLogin={toggleLogin}
              username={username}
              password={password}
              isLoading={isLoading}
            />
          ) : (
            <SignupForm
              handleSignUp={handleSignUp}
              toggleLogin={toggleLogin}
              name={name}
              bio={bio}
              username={username}
              password={password}
              avatar={avatar}
              isLoading={isLoading}
            />
          )}
        </Paper>
      </Container>
    </div>
  );
};

const LoginForm = ({ handleLogin, toggleLogin, username, password, isLoading }) => (
  <div style={{ height: "50vh", padding: "1.2rem 2rem", color: "white" }}>
    <Typography   marginLeft={"1rem"} variant="h5"
    color={"white"} >
      Login
    </Typography>
    <form style={{ width: "100%", marginTop: "1rem" }} onSubmit={handleLogin}>
      <TextField
        required
        fullWidth
        label="Username"
        margin="normal"
        variant="outlined"
        value={username.value}
        onChange={username.changeHandler}
      />
      <TextField
        required
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        variant="outlined"
        value={password.value}
        onChange={password.changeHandler}
      />
      <Button
        sx={{ 
          background:"rgba(0,0,0,0.7)",
          color:"white",
          marginTop: "1rem",
          borderRadius:"20px",
          ":hover":{
            color:"black",
            background:"rgba(0,0,0,0.09)",
          }
        }}
        variant="solid"
        color="blue"
        type="submit"
        fullWidth
        disabled={isLoading}
      >
        Login
      </Button>
        <div
        style={{
          display:"flex",
          marginTop:"2rem",
          
        }}
        >
        <Typography textAlign={"center"} m={"1rem"} 
        width={"100%"}
        color={"white"}   
        > 
        First Time Here?
      </Typography>
      <Button 
      style={{
        marginLeft:"-2rem"
      }}
      disabled={isLoading} fullWidth variant="text" onClick={toggleLogin}>
        Become a member
      </Button>
        </div>
    </form>
  </div>
);

const SignupForm = ({ handleSignUp, toggleLogin, name, bio, username, password, avatar, isLoading }) => (
  <div 
  style={{padding: "1.2rem 2rem", color: "white" }}
  
  >
    <Typography variant="h5" color={"white"} >Sign Up</Typography>
    <form style={{ width: "100%", marginTop: "1rem" }} onSubmit={handleSignUp}>
      <Stack position={"relative"} width={"10rem"} margin={"auto"}>
        <Avatar sx={{ width: "10rem", height: "10rem", objectFit: "contain" }} src={avatar.preview} />
        <IconButton
          sx={{
            position: "absolute",
            bottom: "0",
            right: "0",
            color: "white",
            bgcolor: "rgba(0,0,0,0.5)",
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
          component="label"
        >
          <>
            <CameraAltIcon />
            <VisuallyHiddenInput type="file" onChange={avatar.changeHandler} />
          </>
        </IconButton>
      </Stack>
      {avatar.error && (
        <Typography m={"1rem auto"} width={"fit-content"} display={"block"} color="error" variant="caption">
          {avatar.error}
        </Typography>
      )}
      <TextField
        required
        fullWidth
        label="Name"
        margin="normal"
        variant="outlined"
        value={name.value}
        onChange={name.changeHandler}
      />
      <TextField
        required
        fullWidth
        label="Bio"
        margin="normal"
        variant="outlined"
        value={bio.value}
        onChange={bio.changeHandler}
      />
      <TextField
        required
        fullWidth
        label="Username"
        margin="normal"
        variant="outlined"
        value={username.value}
        onChange={username.changeHandler}
      />
      {username.error && (
        <Typography color="error" variant="caption">
          {username.error}
        </Typography>
      )}
      <TextField
        required
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        variant="outlined"
        value={password.value}
        onChange={password.changeHandler}
      />
      <Button  
        sx={{ 
          background:"rgba(0,0,0,0.7)",
          color:"white",
          marginTop: "1rem",
          borderRadius:"20px",
          ":hover":{
            color:"black",
            background:"rgba(0,0,0,0.09)",
          }
        }}
        variant="solid"
        color="blue"
        type="submit"
        fullWidth
        disabled={isLoading}
      >
        Sign Up
      </Button>
      <div
        style={{
          display:"flex",
          marginTop:"2rem",
          
        }}
        >
        <Typography textAlign={"center"} m={"1rem"} 
        width={"100%"}
        color={"white"} 
        > 
         Already a member?
      </Typography>
      <Button 
      style={{
        marginLeft:"-2rem"
      }}
      disabled={isLoading} fullWidth variant="text" onClick={toggleLogin}>
        Click to Login
      </Button>
        </div>
    </form>
  </div>
);

export default Login;
