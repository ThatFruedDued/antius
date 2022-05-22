import { LoadingButton } from "@mui/lab";
import { Box, Stack, Typography, TextField } from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import router from "next/router";
import { useState } from "react";

const SignIn: NextPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorType, setErrorType] = useState<"" | "username" | "password">("");
  const [errorMessage, setErrorMessage] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);

  return (
    <>
      <Head>
        <title>Antius | Sign In</title>
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
            Sign In
          </Typography>
          <TextField
            label="Username"
            variant="filled"
            onChange={(e) => {
              setUsername(e.target.value);
              errorType === "username" && setErrorType("");
            }}
            error={errorType === "username"}
            helperText={errorType === "username" ? errorMessage : ""}
            inputProps={{
              maxLength: 20,
            }}
          />
          <TextField
            label="Password"
            variant="filled"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
              errorType === "password" && setErrorType("");
            }}
            error={errorType === "password"}
            helperText={errorType === "password" ? errorMessage : ""}
            inputProps={{
              maxLength: 64,
            }}
          />
          <LoadingButton
            variant="contained"
            loading={signInLoading}
            onClick={async () => {
              setSignInLoading(true);
              const res = await fetch("/api/signIn", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username,
                  password,
                }),
              });
              const data = (await res.json()) as {
                success: boolean;
                errorType?: "username" | "password";
                errorMessage?: string;
                token?: string;
              };
              if (data.success) {
                localStorage.setItem("token", data.token ?? "");
                router.replace("/home");
              } else {
                setErrorType(data.errorType ?? "username");
                setErrorMessage(data.errorMessage ?? "Unknown error");
                setSignInLoading(false);
              }
            }}
          >
            Sign In
          </LoadingButton>
        </Stack>
      </Box>
    </>
  );
};

export default SignIn;
