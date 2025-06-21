import jwt from "jsonwebtoken";

const createToken = (res, userId, role) => {
  const jwtSecret =
    process.env.JWT_SECRET || "fallbackSecretKey123DoNotUseInProduction";

  if (!process.env.JWT_SECRET) {
    console.warn(
      "Warning: JWT_SECRET not found in environment variables. Using fallback secret."
    );
  }

  const token = jwt.sign({ userId, role }, jwtSecret, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "lax", // Prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });

  return token;
};

export default createToken;
