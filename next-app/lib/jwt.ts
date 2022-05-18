import jwt from "jsonwebtoken";

export const sign = (data: { userId: string }) => {
  return jwt.sign(data, process.env.JWT_SECRET ?? "", { expiresIn: "7d" });
};

export const verify = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET ?? "") as { userId: string };
};
