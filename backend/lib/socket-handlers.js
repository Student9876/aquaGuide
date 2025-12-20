import CommunityChat from "../models/community_chat.model.js";
import User from "../models/user.model.js";

export function setupChatSocket(io) {
  const chatNamespace = io.of("/api/community/chat");

  chatNamespace.on("connection", async (socket) => {
    console.log(`[Chat] User connected: ${socket.id}`);

    // Get user info from socket handshake or token
    const userId = socket.handshake.auth?.userId;
    if (userId) {
      socket.join(`user-${userId}`);
      socket.data.userId = userId;
      console.log(`[Chat] User ${userId} joined personal room`);
    }

    // Join main chat room
    socket.join("main-chat");
    console.log(`[Chat] ${socket.id} joined main-chat room`);

    // Broadcast that a user joined (optional)
    chatNamespace.to("main-chat").emit("user-joined", {
      message: `A user has joined the chat`,
      timestamp: new Date(),
    });

    /**
     * Event: send-message
     * Emitted when a user sends a message
     */
    socket.on("send-message", async (data, callback) => {
      try {
        const { message, roomID } = data;
        const userId = socket.data.userId;

        if (!userId) {
          return callback({ success: false, error: "User not authenticated" });
        }

        if(!roomID){
            return callback({success: false})
        }

        if (!message || message.trim().length === 0) {
          return callback({
            success: false,
            error: "Message cannot be empty",
          });
        }

        if (message.length > 5000) {
          return callback({
            success: false,
            error: "Message is too long (max 5000 characters)",
          });
        }

        // Save to database
        const newMessage = await CommunityChat.create({
          user_id: userId,
          room_id: roomID,
          message: message.trim(),
        });

        // Fetch the message with user details
        const messageWithUser = await CommunityChat.findByPk(newMessage.id, {
          include: [
            {
              model: User,
              attributes: ["id", "userid", "name"],
            },
          ],
        });

        // Emit to all users in the chat room
        chatNamespace.to(roomID).emit("message-received", {
          id: messageWithUser.id,
          room_id: roomID,
          user_id: messageWithUser.user_id,
          message: messageWithUser.message,
          edited_at: messageWithUser.edited_at,
          is_deleted: messageWithUser.is_deleted,
          created_at: messageWithUser.created_at,
          updated_at: messageWithUser.updated_at,
          User: messageWithUser.User,
        });

        // Send acknowledgment
        callback({
          success: true,
          data: messageWithUser,
          message: "Message sent successfully",
        });

        console.log(`[Chat] Message sent by ${userId}: "${message.substring(0, 50)}..."`);
      } catch (error) {
        console.error("[Chat] Error sending message:", error);
        callback({
          success: false,
          error: "Failed to send message",
        });
      }
    });

    /**
     * Event: edit-message
     * Emitted when a user edits their message
     */
    socket.on("edit-message", async (data, callback) => {
      try {
        const { messageId, message } = data;
        const userId = socket.data.userId;

        if (!userId) {
          return callback({ success: false, error: "User not authenticated" });
        }

        if (!message || message.trim().length === 0) {
          return callback({
            success: false,
            error: "Message cannot be empty",
          });
        }

        const chatMessage = await CommunityChat.findByPk(messageId);

        if (!chatMessage) {
          return callback({ success: false, error: "Message not found" });
        }

        if (chatMessage.user_id !== userId) {
          return callback({
            success: false,
            error: "You can only edit your own messages",
          });
        }

        await chatMessage.update({
          message: message.trim(),
          edited_at: new Date(),
        });

        const updatedMessage = await CommunityChat.findByPk(messageId, {
          include: [
            {
              model: User,
              attributes: ["id", "userid", "name"],
            },
          ],
        });

        // Broadcast edit to all users
        chatNamespace.to("main-chat").emit("message-edited", {
          id: updatedMessage.id,
          user_id: updatedMessage.user_id,
          message: updatedMessage.message,
          edited_at: updatedMessage.edited_at,
          is_deleted: updatedMessage.is_deleted,
          created_at: updatedMessage.created_at,
          updated_at: updatedMessage.updated_at,
          User: updatedMessage.User,
        });

        callback({
          success: true,
          data: updatedMessage,
          message: "Message updated successfully",
        });

        console.log(
          `[Chat] Message ${messageId} edited by ${userId}`
        );
      } catch (error) {
        console.error("[Chat] Error editing message:", error);
        callback({
          success: false,
          error: "Failed to edit message",
        });
      }
    });

    /**
     * Event: delete-message
     * Emitted when a user deletes their message
     */
    socket.on("delete-message", async (data, callback) => {
      try {
        const { messageId } = data;
        const userId = socket.data.userId;

        if (!userId) {
          return callback({ success: false, error: "User not authenticated" });
        }

        const chatMessage = await CommunityChat.findByPk(messageId);

        if (!chatMessage) {
          return callback({ success: false, error: "Message not found" });
        }

        if (chatMessage.user_id !== userId) {
          return callback({
            success: false,
            error: "You can only delete your own messages",
          });
        }

        await chatMessage.update({
          is_deleted: true,
          message: "[Message deleted]",
        });

        // Broadcast deletion to all users
        chatNamespace.to("main-chat").emit("message-deleted", {
          id: messageId,
          is_deleted: true,
        });

        callback({
          success: true,
          message: "Message deleted successfully",
        });

        console.log(`[Chat] Message ${messageId} deleted by ${userId}`);
      } catch (error) {
        console.error("[Chat] Error deleting message:", error);
        callback({
          success: false,
          error: "Failed to delete message",
        });
      }
    });

    /**
     * Event: typing
     * Emitted when a user is typing
     */
    socket.on("typing", async (data) => {
      try {
        const { isTyping, roomId } = data;
        const userId = socket.data.userId;

        if (!userId) return;
        if (!roomId) return;

        const user = await User.findByPk(userId, {
          attributes: ["id", "userid", "name"],
        });

        if (user) {
          chatNamespace.to(roomId).emit("user-typing", {
            userId,
            roomId,
            isTyping,
            user,
          });
        }
      } catch (error) {
        console.error("[Chat] Error in typing event:", error);
      }
    });

    /**
     * Event: load-messages
     * Emitted when a user joins and wants to load chat history
     */
    socket.on("load-messages", async (data, callback) => {
      try {
        const { page = 1, limit = 50 } = data || {};
        const offset = (page - 1) * limit;

        const { count, rows } = await CommunityChat.findAndCountAll({
          where: { is_deleted: false },
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

        callback({
          success: true,
          data: rows,
          pagination: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
          },
        });

        console.log(
          `[Chat] Loaded ${rows.length} messages for user ${socket.data.userId}`
        );
      } catch (error) {
        console.error("[Chat] Error loading messages:", error);
        callback({
          success: false,
          error: "Failed to load messages",
        });
      }
    });

    /**
     * Event: get-user-info
     * Emitted when a user wants to authenticate
     */
    socket.on("authenticate-user", async (data, callback) => {
      try {
        const { userId } = data;

        if (!userId) {
          return callback({ success: false, error: "UserId is required" });
        }

        const user = await User.findByPk(userId, {
          attributes: ["id", "userid", "name", "email", "community_rating"],
        });

        if (!user) {
          return callback({ success: false, error: "User not found" });
        }

        socket.data.userId = userId;
        socket.join(`user-${userId}`);

        callback({
          success: true,
          data: user,
          message: "Authenticated successfully",
        });

        console.log(`[Chat] User ${userId} authenticated`);
      } catch (error) {
        console.error("[Chat] Error authenticating user:", error);
        callback({
          success: false,
          error: "Failed to authenticate",
        });
      }
    });

    /**
     * Event: disconnect
     */
    socket.on("disconnect", (data, callback) => {
      const userId = socket.data.userId;
      const {roomId} = data

      if(!roomId){
        return callback({success: false, error: "Room id required"})
      }
      console.log(`[Chat] User disconnected: ${socket.id}${userId ? ` (${userId})` : ""}`);

      // Broadcast user left message
      chatNamespace.to(roomID).emit("user-left", {
        message: "A user has left the chat",
        timestamp: new Date(),
      });
    });

    /**
     * Event: error handler
     */
    socket.on("error", (error) => {
      console.error(`[Chat] Socket error for ${socket.id}:`, error);
    });
  });
}
