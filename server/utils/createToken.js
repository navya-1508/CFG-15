import jwt from "jsonwebtoken";

const createToken = (res, userId, role) => {
  const jwtSecret =
    process.env.JWT_SECRET || "fallbackSecretKey123DoNotUseInProduction";

  if (!process.env.JWT_SECRET) {
    console.warn(
      "Warning: JWT_SECRET not found in environment variables. Using fallback secret."
    );
  }

  console.log(`CreateToken: Creating JWT for userId: ${userId}, role: ${role}`);

  // Make sure userId is a string
  const userIdStr = String(userId);

  const token = jwt.sign({ userId: userIdStr, role }, jwtSecret, {
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
