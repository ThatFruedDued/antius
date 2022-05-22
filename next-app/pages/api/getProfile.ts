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

  const user = await users.findOne({
    username: new RegExp(`^${username}$`, "gi"),
  });

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

  res.send({
    success: true,
    posts: postResArray,
  });
}
