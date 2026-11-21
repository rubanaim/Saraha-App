# NGL / Saraha: Anonymous Messaging Platform

A secure RESTful backend for an anonymous messaging platform, built with Node.js, Express.js, and MongoDB. Users can receive anonymous messages, request the sender's identity, and continue in private conversations, with a strong focus on authentication, account security, and access control.

## Features
- User registration with email OTP account verification
- Login with JWT access and refresh tokens
- Google login
- Password reset via OTP
- Two-step verification
- Anonymous messaging
- Identity requests (a receiver can request the sender's identity, and the sender decides)
- Private conversations with access control
- Profile picture upload with file validation
- Rate limiting on login and password reset
- Request correlation IDs, centralized error handling, and logging
- CORS configured for a frontend running on `http://localhost:4200`

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (MongoDB Atlas) with Mongoose
- **Authentication:** JWT, password hashing, Google login
- **Other:** Multer (file uploads), cookie-parser, express-rate-limit, CORS

## Project Structure
```
src/
├── app/            # Feature modules
│   ├── auth/
│   ├── user/
│   ├── message/
│   ├── request/
│   └── conversation/
├── lib/            # Shared logic: auth, cache, config, db, email, error,
│                   # idempotency, media, rate-limiter, utils, validation
├── pkg/            # Utilities: cache, correlation, email, logger, utils
├── app.js          # Express app setup and middleware
├── route.js        # Mounts all feature routers
└── server.js       # Server entry point
```

## Getting Started

### Prerequisites
- Node.js installed
- A MongoDB Atlas account (or a local MongoDB)

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/rubanaim/[repo-name].git
   cd [repo-name]
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env` file in the root folder
   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret
   [add the other variables your project uses]
   ```
4. Run the server
   ```bash
   npm run dev
   ```
   The server runs on `http://localhost:8000`, and the API base URL is `http://localhost:8000/api`.

## API Endpoints

All routes below are prefixed with `/api`. Endpoints marked 🔒 require authentication.

<details>
<summary>Click to expand the full endpoint list</summary>

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check that the server is running |

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new account | |
| PATCH | `/api/auth/verify-account` | Verify account with email OTP | |
| POST | `/api/auth/login` | Log in (rate limited) | |
| POST | `/api/auth/send-otp` | Send an OTP to the user's email | |
| POST | `/api/auth/reset-password` | Reset password (rate limited) | |
| POST | `/api/auth/login-with-google` | Log in with Google | |
| PATCH | `/api/auth/enable-2-step-verification` | Enable two-step verification | |
| POST | `/api/auth/verify-to-login` | Complete login with two-step verification | |
| POST | `/api/auth/refresh-token` | Get a new access token using the refresh token | |

### User (`/api/user`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/user/upload-profile-pic` | Upload a profile picture (validated image upload) | 🔒 |

### Messages (`/api/message`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/message` | Send an anonymous message | 🔒 |
| POST | `/api/message/public` | Send a public message | 🔒 |
| GET | `/api/message/get-all-messages` | Get all received messages | 🔒 |

### Identity Requests (`/api/request`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/request/:messageId` | Request the sender's identity for a message | 🔒 |
| GET | `/api/request` | Get all identity requests | 🔒 |
| PATCH | `/api/request/:requestId/decision` | Accept or decline an identity request | 🔒 |

### Conversations (`/api/conversation`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/conversation/:conversationId` | Send a message in a private conversation | 🔒 |

</details>

## Author
**Ruba Naim**, Computer Systems Engineering student, Al-Azhar University, Gaza
