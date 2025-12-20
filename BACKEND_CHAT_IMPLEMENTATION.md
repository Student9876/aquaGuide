# Community Chat Feature - Backend Implementation

## Overview

A real-time community chat feature using **Socket.IO WebSockets** with persistent database storage. Features real-time messaging, message editing/deletion, typing indicators, and user presence notifications.

## Architecture

### Technology Stack

- **Real-time Communication**: Socket.IO (WebSocket + fallback)
- **Database**: Sequelize ORM with PostgreSQL
- **Framework**: Express.js
- **Node Runtime**: Node.js

### Key Components

#### 1. Database Model

**File**: `backend/models/community_chat.model.js`

```
CommunityChat Table:
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key → User)
├── message (TEXT, 1-5000 chars)
├── edited_at (TIMESTAMP, nullable)
├── is_deleted (BOOLEAN, default false)
├── created_at (TIMESTAMP, auto)
└── updated_at (TIMESTAMP, auto)
```

**Associations**:

- User → CommunityChat (One-to-Many)
- CommunityChat → User (Many-to-One)

---

#### 2. Socket.IO Handler

**File**: `backend/lib/socket-handlers.js`

Namespace: `/api/community/chat`

**Client → Server Events**:

- `authenticate-user` - User authentication
- `load-messages` - Load chat history
- `send-message` - Send new message
- `edit-message` - Edit own message
- `delete-message` - Delete own message
- `typing` - Broadcast typing status

**Server → Client Events**:

- `message-received` - New message broadcast
- `message-edited` - Message edit broadcast
- `message-deleted` - Message delete broadcast
- `user-typing` - Typing indicator
- `user-joined` - User join notification
- `user-left` - User leave notification

---

#### 3. REST API Controller

**File**: `backend/controllers/community_chat.controller.js`

**Endpoints** (for history and statistics only):

| Method | Endpoint                      | Auth        | Purpose                          |
| ------ | ----------------------------- | ----------- | -------------------------------- |
| GET    | `/api/community/chat`         | ✅ Required | Get all messages with pagination |
| GET    | `/api/community/chat/recent`  | ❌ Optional | Get recent messages              |
| GET    | `/api/community/chat/:userId` | ✅ Required | Get user's messages              |
| GET    | `/api/community/chat/stats`   | ❌ Optional | Get chat statistics              |

---

#### 4. Routes

**File**: `backend/routes/community_chat.route.js`

Routes for REST API endpoints (history, statistics)
Real-time operations handled via WebSocket events

---

#### 5. Server Integration

**File**: `backend/server.js`

- Socket.IO initialized on port 5000
- CORS enabled for WebSocket connections
- Transport: WebSocket + Polling fallback
- Chat namespace mounted at `/api/community/chat`

---

## Usage Flow

### 1. Connect to WebSocket

```javascript
const socket = io("http://localhost:5000/api/community/chat", {
  auth: { userId: "user-uuid" },
  transports: ["websocket", "polling"],
});
```

### 2. Authenticate User

```javascript
socket.emit("authenticate-user", { userId }, (response) => {
  // Authenticated, now can send messages
});
```

### 3. Load Message History

```javascript
socket.emit("load-messages", { page: 1, limit: 50 }, (response) => {
  // Display historical messages
});
```

### 4. Send Message in Real-time

```javascript
socket.emit("send-message", { message: "Hello!" }, (response) => {
  // Message sent and stored in DB
});
```

### 5. Listen for Messages

```javascript
socket.on("message-received", (message) => {
  // Display new message in UI
});
```

### 6. Edit/Delete Messages

```javascript
socket.emit("edit-message", { messageId, message: "Updated" }, callback);
socket.emit("delete-message", { messageId }, callback);
```

---

## Features Implemented

### ✅ Real-time Messaging

- Instant message delivery via WebSocket
- Database persistence
- Message history loading

### ✅ Message Management

- Send messages (1-5000 chars)
- Edit own messages (tracks edit timestamp)
- Soft delete messages (marked as deleted, not removed)
- Message validation and sanitization

### ✅ User Features

- User authentication via Socket.IO handshake
- Typing indicators to notify others
- User presence (join/leave notifications)
- User info (id, username, name) in messages

### ✅ API Coverage

- REST endpoints for history fetching
- Statistics: total messages, total users, daily breakdown
- Pagination support
- Authentication-based access control

### ✅ Reliability

- Automatic reconnection (5 second delay, max 5 attempts)
- WebSocket + HTTP polling fallback
- Error handling on socket events
- Database transaction consistency

### ✅ Performance

- Pagination for message history
- Efficient queries with Sequelize
- Room-based broadcasting (only main-chat room)
- Indexed user_id foreign key

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Socket.IO Client                                     │  │
│  │ - Connect to /api/community/chat                     │  │
│  │ - Emit/listen events                                │  │
│  │ - Display real-time messages                        │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                  Socket.IO WebSocket
                    (Bidirectional)
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                SERVER (Backend Node.js)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Socket.IO Handler (socket-handlers.js)               │  │
│  │ - /api/community/chat namespace                       │  │
│  │ - Event handlers (send, edit, delete, etc.)         │  │
│  │ - Broadcasting to room                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│  ┌────────────────────────▼──────────────────────────────┐ │
│  │ REST API Controller (community_chat.controller.js)    │ │
│  │ - GET /messages (history)                            │ │
│  │ - GET /stats (statistics)                            │ │
│  └────────────────────────┬───────────────────────────── │ │
└───────────────────────────┼──────────────────────────────┘
                            │
                   Sequelize ORM
                            │
┌───────────────────────────▼──────────────────────────────────┐
│              PostgreSQL Database                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ CommunityChat Table                                   │   │
│  │ - id, user_id, message, edited_at, is_deleted       │   │
│  │ - created_at, updated_at                            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ User Table (related)                                  │   │
│  │ - id, userid, name, email, etc.                     │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

---

## Files Created/Modified

### New Files

- `backend/lib/socket-handlers.js` - Socket.IO event handlers
- `backend/COMMUNITY_CHAT_WEBSOCKET_API.md` - API documentation
- `BACKEND_CHAT_IMPLEMENTATION.md` - This implementation guide

### Modified Files

- `backend/models/community_chat.model.js` - Completed model with all fields
- `backend/controllers/community_chat.controller.js` - REST API for history/stats
- `backend/routes/community_chat.route.js` - Routes for REST endpoints
- `backend/models/associations.js` - Added CommunityChat ↔ User association
- `backend/server.js` - Integrated Socket.IO handler

---

## Setup Instructions

### 1. Install Dependencies

Socket.IO should already be installed. If not:

```bash
npm install socket.io
```

### 2. Start Server

```bash
npm start
# Server runs on http://localhost:5000
# Socket.IO available at ws://localhost:5000/api/community/chat
```

### 3. Database

The model is auto-synced via Sequelize. Table will be created automatically on first run.

### 4. Connect Client

```javascript
import io from "socket.io-client";

const socket = io("http://localhost:5000/api/community/chat", {
  auth: { userId: "your-user-id" },
  transports: ["websocket", "polling"],
});
```

---

## API Examples

### Send Message

```javascript
socket.emit("send-message", { message: "Hello community!" }, (response) => {
  if (response.success) {
    console.log("Message sent:", response.data.id);
  }
});
```

### Edit Message

```javascript
socket.emit(
  "edit-message",
  { messageId: "msg-uuid", message: "Updated message" },
  (callback) => console.log(callback)
);
```

### Delete Message

```javascript
socket.emit("delete-message", { messageId: "msg-uuid" }, (callback) =>
  console.log(callback)
);
```

### Load History

```javascript
socket.emit("load-messages", { page: 1, limit: 50 }, (response) => {
  if (response.success) {
    console.log("Messages:", response.data);
  }
});
```

### Listen for New Messages

```javascript
socket.on("message-received", (message) => {
  console.log(`${message.User.name}: ${message.message}`);
});
```

---

## Notes

- ✅ Backend only implementation (no frontend code)
- ✅ Real-time WebSocket communication
- ✅ Persistent database storage
- ✅ Message validation and error handling
- ✅ User authentication required for sending
- ✅ Scalable architecture with rooms/namespaces
- ✅ Comprehensive API documentation included

For detailed API documentation, see: `backend/COMMUNITY_CHAT_WEBSOCKET_API.md`
