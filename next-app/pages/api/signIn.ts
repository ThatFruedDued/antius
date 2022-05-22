import { NextApiRequest, NextApiResponse } from "next";
import mongo from "../../lib/mongo";
import bcrypt from "bcrypt";
import { sign } from "../../lib/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };
  const db = (await mongo).db("antius");
  const users = db.collection("users");

  const user = await users.findOne({
    username: new RegExp(`^${username}$`, "i"),
  });
  if (!user) {
    res.status(404).send({
      success: false,
      errorType: "username",
      errorMessage: "Username not found",
    });
    return;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    res.status(401).send({
      success: false,
      errorType: "password",
      errorMessage: "Password incorrect",
    });
    return;
  }

  res.status(200).send({
    success: true,
    token: sign({ userId: user._id.toString() }),
  });
}
