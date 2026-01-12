import CommunityChat from "../models/community_chat.model.js";
import CommunityMessage from "../models/community_chat_messages.model.js";
import User from "../models/user.model.js";

export function setupChatSocket(io) {
  const chatNamespace = io.of("/api/community/chat");

  chatNamespace.on("connection", (socket) => {
    console.log(`[Chat] User connected: ${socket.id}`);

    // Auth (temporary – JWT middleware recommended)
    const userId = socket.handshake.auth?.userId;
    if (userId) {
      socket.data.userId = userId;
      socket.join(`user-${userId}`);
      console.log(`[Chat] User ${userId} authenticated`);
    }

    /**
     * JOIN COMMUNITY
     */
    socket.on("join-community", (communityId, callback) => {
      if (!communityId) {
        return callback?.({
          success: false,
          error: "Community ID required",
        });
      }

      socket.join(communityId);

      console.log(`[Chat] Socket ${socket.id} joined community ${communityId}`);

      chatNamespace.to(communityId).emit("user-joined", {
        communityId,
        userId: socket.data.userId,
        timestamp: new Date(),
      });

      callback?.({ success: true });
    });

    /**
     * SEND MESSAGE
     */
    socket.on("send-message", async (data, callback) => {
      try {
        const { message, communityId } = data;
        const userId = socket.data.userId;

        if (!userId) {
          return callback({
            success: false,
            error: "User not authenticated",
          });
        }

        if (!communityId) {
          return callback({
            success: false,
            error: "Community ID required",
          });
        }

        if (!message || !message.trim()) {
          return callback({
            success: false,
            error: "Message cannot be empty",
          });
        }

        if (message.length > 5000) {
          return callback({
            success: false,
            error: "Message too long (max 5000 chars)",
          });
        }

        // Store message in DB
        const newMessage = await CommunityMessage.create({
          user_id: userId,
          community_id: communityId, // room_id == community_id
          message: message.trim(),
        });

        // Fetch with user data
        const messageWithUser = await CommunityMessage.findByPk(newMessage.id, {
          include: [
            {
              model: User,
              as: "sender",
              attributes: ["id", "userid", "name"],
            },
          ],
        });

        console.log(messageWithUser);

        // Broadcast to community
        chatNamespace.to(communityId).emit("message-received", {
          id: messageWithUser.id,
          community_id: communityId,
          message: messageWithUser.message,
          created_at: messageWithUser.created_at,
          sender: messageWithUser.sender,
        });

        callback?.({ success: true });
      } catch (error) {
        console.error("[Chat] Error sending message:", error);
        callback?.({ success: false });
      }
    });

    /**
     * TYPING INDICATOR
     */
    socket.on("typing", async (data) => {
      try {
        const { communityId, isTyping } = data;
        const userId = socket.data.userId;

        if (!userId || !communityId) return;

        const user = await User.findByPk(userId, {
          attributes: ["id", "userid", "name"],
        });

        if (!user) return;

        socket.to(communityId).emit("user-typing", {
          communityId,
          user,
          isTyping,
        });
      } catch (error) {
        console.error("[Chat] Typing error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`[Chat] User disconnected: ${socket.id}`);
    });

    socket.on("error", (error) => {
      console.error("[Chat] Socket error:", error);
    });
  });
}
