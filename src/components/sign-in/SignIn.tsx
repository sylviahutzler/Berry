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
import {forestGreen, slate, gold, coral, mintGreen, cream} from "../shared-theme/themePrimitives";

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

  // Email/password login
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

  // Google login
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
        <Card sx={{ backgroundColor: cream[500], p: 2 }} variant="outlined"variant="outlined">
          <Typography component="h1" variant="h4" sx={{ textAlign: "center", fontFamily: '"Meow Script", "Meow Script_R", cursive', color: slate[500], }}>
            Sign In
          </Typography>

          <Box component="form" onSubmit={handleSignIn} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <FormControl>
              <FormLabel sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                color: slate[500]}} htmlFor="email">Email</FormLabel>
              <TextField sx={{
                '& .MuiOutlinedInput-root': {
                  color: slate[500], // Input text color
                  '& fieldset': {
                    borderColor: slate[500], // Border color
                  },
                  '&:hover fieldset': {
                    borderColor: slate[500], // Border on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: slate[500], // Border when focused
                  }
                },
                '& .MuiInputBase-input': {
                  color: slate[500], // Text color
                  fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                },
                '& .MuiInputLabel-root': {
                  color: slate[500], // Label color
                  fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: slate[500], // After click color
                },
              }}
                id="email"
                name="email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                color: slate[500]}} htmlFor="password">Password</FormLabel>
              <TextField sx={{
                '& .MuiOutlinedInput-root': {
                  color: slate[500], // Input text color
                  '& fieldset': {
                    borderColor: slate[500], // Border color
                  },
                  '&:hover fieldset': {
                    borderColor: slate[500], // Border on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: slate[500], // Border when focused
                  }
                },
                '& .MuiInputBase-input': {
                  color: slate[500], // Text color
                  fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                },
                '& .MuiInputLabel-root': {
                  color: slate[500], // Label color
                  fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: slate[500], // After click color
                },
              }}
                id="password"
                name="password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            {error && <Typography color="error">{error}</Typography>}

            <Button sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
              color: cream[500], backgroundcolor: slate[500]}} type="submit" variant="contained" fullWidth>
              Sign In
            </Button>
          </Box>

          <Divider sx={{ my: 2 }}>
            <Typography sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif', color: forestGreen[500],}}>or</Typography>
          </Divider>

          <Stack spacing={2}>
            <Button sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',}} fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={handleGoogleSignIn}>
              Sign in with Google
            </Button>


            <Typography sx={{ textAlign: "center", fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
              color: slate[500] }}>
              Don’t have an account?
              <MuiLink component={RouterLink} to="/signup"> Sign up</MuiLink>
            </Typography>
          </Stack>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
