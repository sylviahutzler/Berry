import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import MuiLink from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme";
import { GoogleIcon } from "./components/CustomIcons";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import { auth, googleProvider } from "../../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

export default function SignIn() {
    const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  // ✅ Email/password login
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Signed in user:", user);
      navigate("/");   // send user to home
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  // ✅ Google login
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google user:", user);
      navigate("/"); // redirect to home

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };



  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="center">
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ textAlign: "center" }}>
            Sign In
          </Typography>

          <Box component="form" onSubmit={handleSignIn} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                id="email"
                name="email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                id="password"
                name="password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            {error && <Typography color="error">{error}</Typography>}

            <Button type="submit" variant="contained" fullWidth>
              Sign In
            </Button>
          </Box>

          <Divider sx={{ my: 2 }}>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>

          <Stack spacing={2}>
            <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={handleGoogleSignIn}>
              Sign in with Google
            </Button>


            <Typography sx={{ textAlign: "center" }}>
              Don’t have an account?
              <MuiLink component={RouterLink} to="/signup"> Sign up</MuiLink>
            </Typography>
          </Stack>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
