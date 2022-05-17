import { LoadingButton } from "@mui/lab";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

const SignUp: NextPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);

  return (
    <>
      <Head>
        <title>Antius | Sign Up</title>
      </Head>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100vw"
      >
        <Stack spacing={2}>
          <Typography variant="h1" sx={{ mb: 3 }}>
            Sign Up
          </Typography>
          <TextField
            label="Username"
            variant="filled"
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Create a Password"
            variant="filled"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            variant="filled"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <LoadingButton
            variant="contained"
            loading={signUpLoading}
            onClick={() => {
              setSignUpLoading(true);
            }}
          >
            Sign Up
          </LoadingButton>
        </Stack>
      </Box>
    </>
  );
};

export default SignUp;
