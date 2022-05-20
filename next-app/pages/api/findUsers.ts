import { NextApiRequest, NextApiResponse } from "next";
import mongo from "../../lib/mongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  const db = (await mongo).db("antius");
  const users = db.collection("users");
  const { query } = req.body as { query: string };

  if (!query) {
    res.send([]);
    return;
  }

  const results = await users
    .find({ username: new RegExp(query, "gi") })
    .limit(8)
    .toArray();

  res.send(results.map((document) => document.username));
}
