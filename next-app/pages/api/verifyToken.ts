import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "../../lib/jwt";
import mongo from "../../lib/mongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    success: boolean;
    token?: { userId: string; username: string };
  }>
) {
  try {
    const { token } = req.body as { token: string };
    if (!token) {
      res.send({ success: false });
      return;
    }
    const { userId } = verify(token);
    const db = (await mongo).db("antius");
    const users = db.collection("users");
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      res.send({ success: false });
      return;
    }
    res.send({
      success: true,
      token: { userId, username: user.username },
    });
  } catch {
    res.send({ success: false });
  }
}
