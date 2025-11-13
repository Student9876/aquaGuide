import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; 

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized - No access token provided" });
    }

    try {
      // Decode and verify JWT
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      // Find user by ID (Sequelize)
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach user object to request
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Unauthorized - Access token expired" });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    return res.status(401).json({ message: "Unauthorized - Invalid access token" });
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
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'support')) {
        return res.status(403).json({ message: "Admin or Support privileges required." });
    }
    next();
};

export const supportOnlyRoute = (req, res, next) => {
    // The original code allowed either 'admin' OR 'support' to unlock a user.
    if (!req.user || (req.user.role !== 'support')) {
        return res.status(403).json({ message: "Admin or Support privileges required." });
    }
    next();
};