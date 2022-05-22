import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "../../lib/jwt";
import mongo from "../../lib/mongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  const { postId, token, content } = req.body as {
    postId: string;
    token: string;
    content: string;
  };

  if (!postId) {
    res.status(400).send({
      success: false,
      errorMessage: "Post ID is required",
    });
    return;
  }

  if (!token) {
    res.status(401).send({
      success: false,
      errorMessage: "Unauthorized (try logging out and back in)",
    });
    return;
  }

  if (!content) {
    res.status(400).send({
      success: false,
      errorMessage: "Content is required",
    });
    return;
  }

  if (content.length > 100) {
    res.status(400).send({
      success: false,
      errorMessage: "Content cannot be longer than 100 characters",
    });
    return;
  }

  const db = (await mongo).db("antius");
  const users = db.collection("users");
  const tokenData = verify(token);
  const commentor = await users.findOne({
    _id: new ObjectId(tokenData.userId),
  });

  if (!commentor) {
    res.status(404).send({
      success: false,
      errorMessage: "User not found",
    });
    return;
  }

  const posts = db.collection("posts");
  const post = await posts.findOne({ _id: new ObjectId(postId) });

  if (!post) {
    res.status(404).send({
      success: false,
      errorMessage: "Post not found",
    });
    return;
  }

  const comments = db.collection("comments");
  await comments.insertOne({
    postId: new ObjectId(postId),
    createdAt: new Date(),
    content,
    creator: commentor.username,
  });

  res.send({
    success: true,
  });
}
