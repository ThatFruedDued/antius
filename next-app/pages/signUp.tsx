import { LoadingButton } from "@mui/lab";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

const SignUp: NextPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [errorType, setErrorType] = useState<
    "" | "username" | "password" | "confirmPassword"
  >("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

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
            onChange={(e) => {
              setUsername(e.target.value);
              errorType === "username" && setErrorType("");
            }}
            error={errorType === "username"}
            helperText={errorType === "username" ? errorMessage : ""}
          />
          <TextField
            label="Create a Password"
            variant="filled"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
              errorType === "password" && setErrorType("");
            }}
            error={errorType === "password"}
            helperText={errorType === "password" ? errorMessage : ""}
          />
          <TextField
            label="Confirm Password"
            variant="filled"
            type="password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              errorType === "confirmPassword" && setErrorType("");
            }}
            error={errorType === "confirmPassword"}
            helperText={errorType === "confirmPassword" ? errorMessage : ""}
          />
          <LoadingButton
            variant="contained"
            loading={signUpLoading}
            onClick={async () => {
              setSignUpLoading(true);
              if (password !== confirmPassword) {
                setErrorType("confirmPassword");
                setErrorMessage("Passwords do not match");
                setSignUpLoading(false);
                return;
              }
              const res = await fetch("/api/signUp", {
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
                setSignUpLoading(false);
              }
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
