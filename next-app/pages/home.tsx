import { LoadingButton } from "@mui/lab";
import { Box, Paper, Stack, TextField } from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import useToken from "../hooks/useToken";
import NavBar from "../components/NavBar";
import Post from "../components/Post";

const Home: NextPage = () => {
  const [postContent, setPostContent] = useState("");
  const [postLoading, setPostLoading] = useState(false);
  const [postErrorMessage, setPostErrorMessage] = useState("");
  const [posts, setPosts] = useState<
    {
      dateCreated: number;
      content: string;
      id: string;
      comments: {
        dateCreated: number;
        content: string;
        creator: string;
      }[];
    }[]
  >([]);

  const [isLoggedIn, username] = useToken();

  const router = useRouter();

  const refreshPosts = useCallback(async () => {
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
        id: string;
        comments: {
          dateCreated: number;
          content: string;
          creator: string;
        }[];
      }[];
    };
    setPosts(data.posts ?? []);
  }, [username]);

  useEffect(() => {
    if (isLoggedIn === false) {
      router.replace("/");
    } else if (username) {
      refreshPosts();
    }
  }, [isLoggedIn, username, router, refreshPosts]);

  return (
    <>
      <Head>
        <title>Antius | Home</title>
      </Head>
      <NavBar />
      <Stack>
        <Paper
          elevation={2}
          sx={{
            m: 3,
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TextField
            variant="outlined"
            sx={{ m: 1, flexGrow: 1 }}
            label="Write about anything..."
            multiline
            rows={8}
            value={postContent}
            disabled={postLoading}
            error={postErrorMessage !== ""}
            helperText={postErrorMessage}
            onChange={(e) => {
              setPostContent(e.target.value);
              setPostErrorMessage("");
            }}
            inputProps={{
              maxLength: 500,
            }}
          ></TextField>
          <Box
            flexGrow={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <LoadingButton
              variant="contained"
              color="success"
              disabled={postContent.length === 0}
              loading={postLoading}
              onClick={async () => {
                setPostLoading(true);
                const res = await fetch("/api/createPost", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    postContent,
                    token: localStorage.getItem("token"),
                  }),
                });
                const data = (await res.json()) as {
                  success: boolean;
                  errorMessage?: string;
                };
                if (data.success) {
                  setPostContent("");
                  setPostLoading(false);
                  refreshPosts();
                } else {
                  setPostErrorMessage(data.errorMessage ?? "");
                  setPostLoading(false);
                }
              }}
            >
              Post
            </LoadingButton>
          </Box>
        </Paper>
        {posts
          .sort((a, b) => b.dateCreated - a.dateCreated)
          .map((post) => (
            <Post
              author={username ?? ""}
              content={post.content}
              key={post.id}
              postId={post.id}
              comments={post.comments}
              reloadPosts={refreshPosts}
            />
          ))}
      </Stack>
    </>
  );
};

export default Home;
