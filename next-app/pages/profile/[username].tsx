import { Box, Typography } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Profile: NextPage = () => {
  const router = useRouter();
  const { username } = router.query as { username: string };
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/getProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
        }),
      });
      const data = (await res.json()) as {
        success: boolean;
        redirect?: string;
        errorMessage?: string;
        posts?: {
          dateCreated: number;
          content: string;
          comments: {
            dateCreated: number;
            content: string;
            creator: string;
          }[];
        }[];
      };

      if (data.success) {
      } else if (data.redirect) {
        router.replace(data.redirect);
      } else {
        setErrorMessage(data.errorMessage);
      }
    })();
  }, []);

  return (
    <>
      {errorMessage ? (
        <Box
          display="flex"
          height="100vh"
          width="100vw"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h1">{errorMessage}</Typography>
        </Box>
      ) : (
        <>Success</>
      )}
    </>
  );
};

export default Profile;
