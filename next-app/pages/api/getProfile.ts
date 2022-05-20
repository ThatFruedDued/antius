import { NextApiRequest, NextApiResponse } from "next";
import mongo from "../../lib/mongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
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
  }>
) {
  const db = (await mongo).db("antius");
  const users = db.collection("users");
  const { username } = req.body as { username: string };

  const user = await users.findOne({ username: new RegExp(username, "gi") });

  if (!user) {
    res.status(404).send({
      success: false,
      errorMessage: "User not found",
    });
    return;
  }

  if (user.username !== username) {
    res.send({
      success: false,
      redirect: "/profile/" + user.username,
      errorMessage: "Redirecting...",
    });
    return;
  }

  res.send({
    success: true,
    posts: user.posts.map(
      (post: {
        dateCreated: Date;
        content: string;
        comments: { creator: string; content: string; dateCreated: Date }[];
      }) => ({
        dateCreated: post.dateCreated.getTime(),
        content: post.content,
        comments: post.comments.map((comment) => ({
          creator: comment.creator,
          content: comment.content,
          dateCreated: comment.dateCreated.getTime(),
        })),
      })
    ),
  });
}
