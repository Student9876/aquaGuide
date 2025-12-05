import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // ✅ Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    const accessToken = authHeader.split(" ")[1];

    try {
      // ✅ Verify JWT
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      // ✅ Fetch user from DB (exclude password)
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return res.status(401).json({
          message: "Unauthorized - User not found",
        });
      }

      // ✅ Attach user to request
      req.user = user;

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Unauthorized - Token expired",
        });
      }

      return res.status(401).json({
        message: "Unauthorized - Invalid token",
      });
    }
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// -------------------------
// ADMIN ROUTE MIDDLEWARE
// -------------------------
export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
};

export const supportOrAdminRoute = (req, res, next) => {
  // The original code allowed either 'admin' OR 'support' to unlock a user.
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "support")) {
    return res
      .status(403)
      .json({ message: "Admin or Support privileges required." });
  }
  next();
};

export const supportOnlyRoute = (req, res, next) => {
  // The original code allowed either 'admin' OR 'support' to unlock a user.
  if (!req.user || req.user.role !== "support") {
    return res
      .status(403)
      .json({ message: "Admin or Support privileges required." });
  }
  next();
};
