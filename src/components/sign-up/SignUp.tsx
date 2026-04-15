// src/pages/SignUp.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme";
import { GoogleIcon, FacebookIcon } from "./components/CustomIcons";
import MuiLink from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

import { auth, googleProvider } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: { width: "450px" },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: { padding: theme.spacing(4) },
}));

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [allowEmails, setAllowEmails] = React.useState(false);

  const [nameError, setNameError] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [firebaseError, setFirebaseError] = React.useState("");

  const validateInputs = (): boolean => {
    let valid = true;
    setNameError(""); setEmailError(""); setPasswordError(""); setFirebaseError("");

    if (!name.trim()) { setNameError("Name is required."); valid = false; }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setEmailError("Enter a valid email."); valid = false; }
    if (!password || password.length < 6) { setPasswordError("Password must be at least 6 characters."); valid = false; }

    return valid;
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) await updateProfile(user, { displayName: name });
      navigate("/"); // redirect to home
    } catch (err: any) { setFirebaseError(err.message); }
  };

  const handleGoogleSignUp = async () => {
    try { await signInWithPopup(auth, googleProvider); navigate("/"); }
    catch (err: any) { setFirebaseError(err.message); }
  };


  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="center">
        <Card variant="outlined">
          Asian Art Website Logo
          <Typography component="h1" variant="h4" sx={{ textAlign: "center" }}>Sign up</Typography>

          <Box component="form" onSubmit={handleSignUp} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField id="name" name="name" placeholder="Jon Snow" fullWidth value={name} onChange={(e)=>setName(e.target.value)} error={!!nameError} helperText={nameError}/>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField id="email" name="email" placeholder="your@email.com" fullWidth value={email} onChange={(e)=>setEmail(e.target.value)} error={!!emailError} helperText={emailError}/>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField id="password" name="password" type="password" placeholder="••••••" fullWidth value={password} onChange={(e)=>setPassword(e.target.value)} error={!!passwordError} helperText={passwordError}/>
            </FormControl>

            <FormControlLabel control={<Checkbox checked={allowEmails} onChange={(e)=>setAllowEmails(e.target.checked)} />} label="I want to receive updates via email." />

            {firebaseError && <Typography color="error">{firebaseError}</Typography>}

            <Button type="submit" variant="contained" fullWidth>Sign up</Button>
          </Box>

          <Divider sx={{ my: 2 }}>or</Divider>

          <Stack spacing={2}>
            <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={handleGoogleSignUp}>Sign up with Google</Button>

            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <MuiLink component={RouterLink} to="/signin">Sign in</MuiLink>
            </Typography>
          </Stack>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
