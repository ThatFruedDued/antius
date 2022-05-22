import { Box, Typography } from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Post from "../../components/Post";

// server-side imports
import mongo from "../../lib/mongo";

const Profile: NextPage<{
  initialRes: {
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
}> = ({ initialRes }) => {
  const router = useRouter();
  const { username } = router.query as { username: string };
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    initialRes.errorMessage
  );
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
  >(initialRes.posts ?? []);

  const refreshPosts = async () => {
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

    if (data.success) {
      setPosts(data.posts || []);
    } else if (data.redirect) {
      router.replace(data.redirect);
    } else {
      setErrorMessage(data.errorMessage);
    }
  };

  useEffect(() => {
    if (initialRes.redirect) {
      router.replace(initialRes.redirect);
    }
    setErrorMessage(initialRes.errorMessage);
    setPosts(initialRes.posts ?? []);
  }, [initialRes, router]);

  return (
    <>
      <Head>
        <title>Antius | {username}</title>
      </Head>
      <NavBar />
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
        posts
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
          ))
      )}
    </>
  );
};

export default Profile;

export async function getServerSideProps({
  query,
}: {
  query: { username: string };
}) {
  const { username } = query;
  const db = (await mongo).db("antius");
  const users = db.collection("users");

  const user = await users.findOne({
    username: new RegExp(`^${username}$`, "gi"),
  });

  if (!user) {
    return {
      props: {
        initialRes: {
          success: false,
          errorMessage: "User not found",
        },
      },
    };
  }

  if (user.username !== username) {
    return {
      props: {
        initialRes: {
          success: false,
          redirect: "/profile/" + user.username,
          errorMessage: "Redirecting...",
        },
      },
    };
  }

  const posts = db.collection("posts");
  const usersPosts = await posts.find({ poster: user.username }).toArray();

  const postResArray = [];

  for (const post of usersPosts) {
    const comments = db.collection("comments");
    const postComments = await comments.find({ postId: post._id }).toArray();
    postResArray.push({
      dateCreated: post.createdAt.getTime(),
      content: post.content,
      id: post._id.toString(),
      comments: postComments.map((comment) => ({
        dateCreated: comment.createdAt.getTime(),
        content: comment.content,
        creator: comment.creator,
      })),
    });
  }

  return {
    props: {
      initialRes: {
        success: true,
        posts: postResArray,
      },
    },
  };
}
