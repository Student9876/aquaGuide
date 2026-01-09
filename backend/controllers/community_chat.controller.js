import User from "../models/user.model.js";
import sequelize from "../lib/db.js";
import { Op, where, fn, col } from "sequelize";
import CommunityMember from "../models/community_member.model.js";
import Community from "../models/community_chat.model.js";

export const joinCommunity = async (req, res) => {
  const communityId = req.params.id;
  const userId = req.user.id;

  const exists = await CommunityMember.findOne({
    where: { community_id: communityId, user_id: userId },
  });

  if (exists) {
    return res.status(400).json({
      success: false,
      error: "Already a member",
    });
  }

  await CommunityMember.create({
    community_id: communityId,
    user_id: userId,
    role: "member",
  });

  res.json({ success: true });
};

export const getPublicCommunities = async (req, res) => {
  try {
    const { count, rows } = await Community.findAndCountAll({
      where: { is_private: false },
      attributes: { exclude: ["created_by"] },

      order: [["created_at", "DESC"]],
    });

    res.json({ success: true, data: rows, count: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const joinedCommunity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { count, rows } = await CommunityMember.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: Community,
          as: "community",
          attributes: ["id", "name", "description"],
        },
      ],
      order: [["created_at", "ASC"]],
    });

    res.status(200).json({
      success: true,
      data: rows,
      count: count,
    });
  } catch (error) {
    console.error("Error fetching joined community:", error);
    res.status(500).json({ error: "Failed to fetch joined community " });
  }
};

export const createCommunity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, is_private } = req.body;

    // Duplicate check (case-insensitive)
    const existing = await Community.findOne({
      where: {
        [Op.and]: [{ name: { [Op.iLike]: name.trim() } }],
      },
    });

    if (existing) {
      return res.status(400).json({
        error: "Community with same name already exists",
        existing: {
          name: existing.name,
          description: existing.description,
        },
      });
    }

    const newCommunity = await Community.create({
      name: name,
      description: description,
      is_private: is_private,
      created_by: userId,
    });
    const addmember = await CommunityMember.create({
      community_id: newCommunity.id,
      user_id: userId,
    });
    return res.status(200).json({
      message: "Community created",
    });
  } catch (error) {
    console.error("Error creating community:", error);
    res.status(500).json({ error: "Failed to create community " });
  }
};
