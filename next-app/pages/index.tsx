import { Box, Button, Stack, Typography } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useToken from "../hooks/useToken";

const Home: NextPage = () => {
  const [isLoggedIn] = useToken();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/home");
    }
  }, [isLoggedIn, router]);

  return (
    <>
      <Head>
        <title>Antius</title>
        <meta name="description" content="The best social media platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100vw"
      >
        <Stack spacing={2}>
          <Typography variant="h1">Antius</Typography>
          <Link href="/signUp" passHref>
            <Button variant="contained">Sign Up</Button>
          </Link>
          <Link href="/signIn" passHref>
            <Button variant="outlined">Sign In</Button>
          </Link>
        </Stack>
      </Box>
    </>
  );
};

export default Home;
