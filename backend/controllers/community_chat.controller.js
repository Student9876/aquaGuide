import CommunityChat from "../models/community_chat.model.js";
import User from "../models/user.model.js";
import sequelize from "../lib/db.js";
import { Op, where, fn, col } from "sequelize";
import CommunityMember from "../models/community_member.model.js";

export const createRoom = async (req, res) => {
  try {
    const userId = req.user.id;
    const { room_id } = req.body;

    const newRoom = await CommunityChat.create({
      user_id: userId,
      room_id: room_id,
    });
  } catch (error) {
    console.error("Error creating chat room:", error);
    res.status(500).json({ error: "Failed to create chat room" });
  }
};
export const getAllMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const room_id = req.query.room_id;
    const offset = (page - 1) * limit;

    const chat = await CommunityChat.findOne({
      where: { id: room_id, is_deleted: false, status: "approved" },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat room not found" });
    }

    const { count, rows } = await CommunityChatMessages.findAndCountAll({
      where: { community_chat_id: room_id },
      include: [
        {
          model: User,
          attributes: ["id", "userid", "name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Get recent messages
export const getRecentMessages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const messages = await CommunityChat.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: User,
          attributes: ["id", "userid", "name"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
    });

    res.status(200).json({
      success: true,
      data: messages.reverse(),
    });
  } catch (error) {
    console.error("Error fetching recent messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Get user's messages
export const getUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const { count, rows } = await CommunityChat.findAndCountAll({
      where: { user_id: userId, is_deleted: false },
      include: [
        {
          model: User,
          attributes: ["id", "userid", "name"],
        },
      ],
      order: [["created_at", "ASC"]],
      limit,
      offset,
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching user messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Get messages statistics
export const getChatStatistics = async (req, res) => {
  try {
    const totalMessages = await CommunityChat.count({
      where: { is_deleted: false },
    });

    const totalUsers = await CommunityChat.count({
      distinct: true,
      col: "user_id",
      where: { is_deleted: false },
    });

    const messagesPerDay = await CommunityChat.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("created_at")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: { is_deleted: false },
      group: [sequelize.fn("DATE", sequelize.col("created_at"))],
      order: [[sequelize.fn("DATE", sequelize.col("created_at")), "DESC"]],
      raw: true,
      limit: 30,
    });

    res.status(200).json({
      success: true,
      data: {
        totalMessages,
        totalUsers,
        messagesPerDay,
      },
    });
  } catch (error) {
    console.error("Error fetching chat statistics:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};

export const createCommunity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;

    // Duplicate check (case-insensitive)
    const existing = await CommunityChat.findOne({
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

    const newCommunity = await CommunityChat.create({
      name: name,
      description: description,
      created_by: userId,
    });
    const addmember = await CommunityMember.create({
      community_id: newCommunity.id,
      user_id: userId
    })
    return res.status(200).json({
      message: "Community created",
      members: addmember,
      data: newCommunity
    });
  } catch (error) {
    console.error("Error creating community:", error);
    res.status(500).json({ error: "Failed to create community " });
  }
};


export const searchCommunuty = async (req, res) => {
  try {
    const {query, page=1, pageSize=20} = req.body
  
    const where = {};
  
      if (query && query.trim()) {
        where[Op.or] = [
          { description: { [Op.iLike]: `%${query}%` } },
          { name: { [Op.iLike]: `%${query}%` } },
        ];
      }
      const limit = pageSize
      const offset = (page-1)*pageSize
       const { rows: users, count: total } = await User.findAndCountAll({
        where,
        attributes: { exclude: ["password"] },
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });
      res.status(200).json({
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        users,
      });
  } catch (error) {
    console.error(error.message)
    res.status(500).json({
      "message":"Server error occured in search community"
    })
  }
}

export const removeMember = async (req, res) => {
  try {
    const { community_id, user_id } = req.body;
    if (!community_id || !user_id) {
      return res.status(400).json({ error: "community_id and user_id are required" });
    }
    const member = await CommunityMember.findOne({
      where: { community_id, user_id },
    });

    if (!member) {
      return res.status(404).json({ error: "Member not found in this community" });
    }

    await member.destroy();

    return res.status(200).json({
      success: true,
      message: "Member removed from community successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to remove member from community" });
  }
}

export const getCommunityChatInfo = async(req, res)=>{
  const {communityId} = req.body
  if(!communityId)
    res.status(400).json({"message":"Community Id is required"})
  const community = await CommunityChat.findOne({
    where: {community_id: communityId}
  })
  if(!community){
    res.json(404).json({"message":"community not Found"})
  }
  const communityMembers = await CommunityMember.findAll({
    where: {community_id: communityId}
  })
  return res.status(200).json({"message":"Community Id info found succesfully",
    "community_chat_info": community,
    "community_chat_members": communityMembers,
    "total_members": communityMembers.length
  })
}