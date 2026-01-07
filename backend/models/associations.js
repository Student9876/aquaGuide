import Comments from "./community_forum_comment.model.js";
import CommunityForum from "./community_forum_model.js";
import CommunityChat from "./community_chat.model.js";
import User from "./user.model.js";
import CommunityMember from "./community_member.model.js";
import Community from "./community_chat.model.js";
import CommunityMessage from "./community_chat_messages.model.js";

CommunityForum.hasMany(Comments, { as: "Comments", foreignKey: "forum_id" });
User.hasMany(CommunityForum, {
  foreignKey: "creator_id",
  onDelete: "CASCADE",
});
CommunityForum.belongsTo(User, {
  foreignKey: "creator_id",
  as: "User",
});
Comments.belongsTo(CommunityForum, {
  as: "CommunityForum",
  foreignKey: "forum_id",
});
Comments.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
User.hasMany(Comments, { foreignKey: "user_id" });

// ================= USER ASSOCIATIONS =================
User.hasMany(Community, {
  foreignKey: "created_by",
  as: "createdCommunities",
});

User.belongsToMany(Community, {
  through: CommunityMember,
  foreignKey: "user_id",
  otherKey: "community_id",
  as: "communities",
});

User.hasMany(CommunityMessage, {
  foreignKey: "user_id",
  as: "communityMessages",
});

// ================= COMMUNITY ASSOCIATIONS =================
Community.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

Community.belongsToMany(User, {
  through: CommunityMember,
  foreignKey: "community_id",
  otherKey: "user_id",
  as: "members",
});

Community.hasMany(CommunityMessage, {
  foreignKey: "community_id",
  as: "messages",
});

// ================= COMMUNITY MEMBER ASSOCIATIONS =================
CommunityMember.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

CommunityMember.belongsTo(Community, {
  foreignKey: "community_id",
  as: "community",
});

// ================= COMMUNITY MESSAGE ASSOCIATIONS =================
CommunityMessage.belongsTo(User, {
  foreignKey: "user_id",
  as: "sender",
});

CommunityMessage.belongsTo(Community, {
  foreignKey: "community_id",
  as: "community",
});

export default function setupAssociations() {}
