import {
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

const Post = ({
  author,
  content,
  postId,
  comments,
  reloadPosts,
}: {
  author: string;
  content: string;
  postId: string;
  comments: {
    dateCreated: number;
    content: string;
    creator: string;
  }[];
  reloadPosts: () => void;
}) => {
  const [comment, setComment] = useState("");
  const [sendCommentLoading, setSendCommentLoading] = useState(false);
  const [commentErrorMessage, setCommentErrorMessage] = useState("");

  return (
    <Paper
      elevation={2}
      sx={{
        my: 1,
        mx: 3,
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6">{author}</Typography>
      <Typography component="span">
        <pre style={{ fontFamily: "inherit" }}>{content}</pre>
      </Typography>
      {comments
        .sort((a, b) => a.dateCreated - b.dateCreated)
        .map((comment) => (
          <Paper key={comment.dateCreated} elevation={4} sx={{ m: 1, p: 2 }}>
            <Typography>
              <b>{comment.creator}:</b>
              {" " + comment.content}
            </Typography>
          </Paper>
        ))}
      <TextField
        sx={{ mt: 2 }}
        value={comment}
        disabled={sendCommentLoading}
        onChange={(e) => {
          setComment(e.target.value);
          setCommentErrorMessage("");
        }}
        variant="filled"
        label="Add a comment"
        error={commentErrorMessage !== ""}
        helperText={commentErrorMessage}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                disabled={sendCommentLoading || comment.length === 0}
                onClick={async () => {
                  setSendCommentLoading(true);
                  const res = await fetch("/api/createComment", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      postId,
                      content: comment,
                      token: localStorage.getItem("token"),
                    }),
                  });
                  const json = (await res.json()) as {
                    success: boolean;
                    errorMessage?: string;
                  };
                  if (json.success) {
                    setComment("");
                    setCommentErrorMessage("");
                    setSendCommentLoading(false);
                    reloadPosts();
                  } else if (json.errorMessage) {
                    setCommentErrorMessage(json.errorMessage);
                    setSendCommentLoading(false);
                  }
                }}
              >
                <SendRoundedIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        inputProps={{
          maxLength: 100,
        }}
      ></TextField>
    </Paper>
  );
};

export default Post;
