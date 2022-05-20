import { Box, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";

const NotFoundPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Antius | Not Found</title>
      </Head>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100vw"
      >
        <Stack spacing={2}>
          <Typography variant="h1" textAlign="center">
            404
          </Typography>
          <Typography variant="h2" textAlign="center">
            Not Found
          </Typography>
        </Stack>
      </Box>
    </>
  );
};

export default NotFoundPage;
