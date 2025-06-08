import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ errors: "Unauthorized user" });
    }

    const token = authHeader.split(" ")[1];

    const isTokenBlacklisted = await redisClient.get(token);
    if (isTokenBlacklisted) {
      return res.status(401).send({ errors: "Token blacklisted" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken);
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).send({ errors: "Unauthorized user" });
  }
};

