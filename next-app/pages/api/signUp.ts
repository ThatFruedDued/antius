import { NextApiRequest, NextApiResponse } from "next";
import mongo from "../../lib/mongo";
import bcrypt from "bcrypt";
import { sign } from "../../lib/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    success: boolean;
    errorType?: "username" | "password";
    errorMessage?: string;
    token?: string;
  }>
) {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };

  if (!username) {
    res.status(400).json({
      success: false,
      errorType: "username",
      errorMessage: "You must supply a username",
    });
    return;
  }

  if (username.length > 20) {
    res.status(400).json({
      success: false,
      errorType: "username",
      errorMessage: "Username cannot be longer than 20 characters",
    });
    return;
  }

  if (!/^[a-zA-Z0-9_]*$/.test(username)) {
    res.status(400).json({
      success: false,
      errorType: "username",
      errorMessage:
        "Username must only contain letters, numbers and underscores",
    });
    return;
  }

  if (!password) {
    res.status(400).json({
      success: false,
      errorType: "password",
      errorMessage: "You must supply a password",
    });
    return;
  }

  if (password.length > 64) {
    res.status(400).json({
      success: false,
      errorType: "password",
      errorMessage: "Password cannot be longer than 64 characters",
    });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({
      success: false,
      errorType: "password",
      errorMessage: "Password must be at least 6 characters long",
    });
    return;
  }

  const db = mongo.db("antius");
  const users = db.collection("users");

  const user = await users.findOne({
    username: new RegExp(`^${username}$`, "i"),
  });

  if (user) {
    res.status(400).json({
      success: false,
      errorType: "username",
      errorMessage: "Username is already taken",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await users.insertOne({ username, password: hashedPassword, posts: [] });

  const createdUser = await users.findOne({ username });

  if (!createdUser) {
    res.status(500).end();
    return;
  }

  const token = sign({ userId: createdUser._id.toString() });

  res.status(200).json({
    success: true,
    token,
  });
}
