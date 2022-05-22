import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "../../lib/jwt";
import mongo from "../../lib/mongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token, postContent } = req.body as {
    token: string;
    postContent: string;
  };
  if (!token || !postContent) {
    res.status(400).send({
      success: false,
      errorMessage: "Missing token or post content",
    });
    return;
  }
  if (postContent.length > 500) {
    res.status(400).send({
      success: false,
      errorMessage: "Post content must be at most 500 characters",
    });
    return;
  }
  const { userId } = verify(token);
  const db = (await mongo).db("antius");
  const users = db.collection("users");
  const user = await users.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    res.status(404).send({
      success: false,
      errorMessage: "User not found",
    });
    return;
  }

  const posts = db.collection("posts");
  await posts.insertOne({
    poster: user.username,
    content: postContent,
    createdAt: new Date(),
  });

  res.send({
    success: true,
  });
}
