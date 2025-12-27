import Guest from "../models/guestModel.js";
import {
  getClientIp,
  getCountryCodeFromRequest,
} from "../utils/location.util.js";

export const createGuest = async (req, res) => {
  try {
    const ipAddress = getClientIp(req);
    const countryCode = getCountryCodeFromRequest(req);

    // 1️⃣ Check if guest already exists
    let guest = await Guest.findOne({
      where: { ip_address: ipAddress },
    });

    if (guest) {
      return res.status(200).json({
        success: true,
        message: "Guest already exists",
        guest,
      });
    }

    // 2️⃣ Create new guest
    guest = await Guest.create({
      ip_address: ipAddress,
      country_code: countryCode,
    });

    return res.status(201).json({
      success: true,
      message: "Guest created successfully",
      guest,
    });
  } catch (error) {
    // 3️⃣ Handle race condition
    if (error.name === "SequelizeUniqueConstraintError") {
      const ipAddress = getClientIp(req);

      const guest = await Guest.findOne({
        where: { ip_address: ipAddress },
      });

      return res.status(200).json({
        success: true,
        message: "Guest already exists",
        guest,
      });
    }

    console.error("Guest create error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
