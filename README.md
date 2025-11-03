# 🎯 U.CONVO - A Smart Communication

Welcome to **U.CONVO**, a full-stack real-time chat application a mini real-time chat dashboard with an AI-powered insights panel for summarizing and analyzing conversations.

---

## 🚀 Project Overview

This project is a monorepo application structured into two main packages:
*   **`be` (Backend):** A robust server built with Node.js, Express, and Prisma. It handles business logic, user authentication, database management, and real-time communication.
*   **`fe` (Frontend):** A responsive and interactive client-side application built with Next.js (App Router) and TypeScript, featuring a modern UI and robust state management with Zustand.

---

## ✨ Key Features

### Backend Features
-   **🔒 Secure Authentication:** JWT-based authentication for user registration, login, and logout, with OAuth support for Google Sign-In.
-   **⚡️ Real-time Communication:** Instant message delivery and online user status updates using WebSockets (Socket.IO).
-   **🤖 AI Insights:** On-demand generation of conversation summaries and sentiment analysis using the Hugging Face Inference API.
-   **🗄️ Database Management:** Efficient data modeling and management for users, messages, and conversations using Prisma ORM with a PostgreSQL database.
-   **🖼️ File Uploads:** Seamless image uploading and cloud storage integration with Cloudinary.
-   **🛡️ Advanced Security:** Protection against common web threats, including bots and rate-limiting, using Arcjet.

### Frontend Features
-   **📱 Responsive Design:** A modern, mobile-first UI that adapts seamlessly to all screen sizes, built with Tailwind CSS and shadcn/ui.
-   **🔐 Route Protection:** Secure routes for authenticated users using Next.js Middleware.
-   **💬 Intuitive Chat Dashboard:** A user-friendly interface to view recent chats and a searchable list of all contacts.
-   **🟢 Online Status Indicator:** Real-time indicators to show whether a user is online or offline.
-   **🧠 AI Insights Panel:** A dedicated panel to display AI-generated summaries and sentiment analysis for the current conversation.
-   **🔄 Centralized State Management:** Efficient and predictable state management using Zustand for auth, chat, and real-time updates.
-   **🔔 Toast Notifications:** User-friendly feedback for actions like login success, errors, and other important events.

---

## 🛠️ Tech Stack

| Category        | Frontend (Next.js)                                 | Backend (Node.js)                                     |
| :-------------- | :------------------------------------------------- | :---------------------------------------------------- |
| **Framework**   | Next.js 16 (App Router)                            | Express.js                                            |
| **Language**    | TypeScript                                         | TypeScript                                            |
| **UI Library**  | React 19                                           | -                                                     |
| **Styling**     | Tailwind CSS, shadcn/ui                            | -                                                     |
| **Database**    | -                                                  | PostgreSQL, Prisma (ORM)                              |
| **State**       | Zustand                                            | -                                                     |
| **Validation**  | React Hook Form, Zod                               | Zod                                                   |
| **Real-time**   | Socket.IO Client                                   | Socket.IO                                             |
| **Auth**        | -                                                  | JWT, Passport.js, bcryptjs                            |
| **API**         | Axios                                              | RESTful API                                           |
| **AI**          | -                                                  | Hugging Face Inference                                |

---

## 🚀 Local Setup & Installation

This project is set up as a pnpm monorepo. Follow these steps to run it locally.

### 1. Prerequisites

-   Node.js (v18 or higher)
-   pnpm (v10 or higher recommended)
-   A running PostgreSQL database instance.

### 2. Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>

# 2. Navigate to the project directory
cd <project-folder>

# 3. Install all dependencies for both frontend and backend
pnpm install
```

### 3. Environment Variables Setup

You need to set up `.env` files for both the frontend and backend packages.

#### **Backend (`be/.env`)**
-   Copy `be/.env.example` to `be/.env` and fill in the required values:
```env
PORT=5001
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-strong-jwt-secret"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
ARCJET_KEY="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
HUGGINGFACE_TOKEN="..."
CLIENT_URL="http://localhost:3000"
```

#### **Frontend (`fe/.env`)**
-   Create a `.env` file in the `fe` directory and add the following variable:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### 4. Database Setup

-   Ensure your `DATABASE_URL` in `be/.env` is correct.
-   Run the Prisma migrations to create the database schema.

```bash
pnpm --filter be prisma migrate dev
```

### 5. Running the Project

Use the following command to start both the frontend and backend development servers concurrently.
```bash
# This command runs both 'pnpm --filter be dev' and 'pnpm --filter fe dev'
pnpm run dev
```

-   The **Backend** will be running on `http://localhost:5001`.
-   The **Frontend** will be running on `http://localhost:3000`.

---

## 📂 Project Structure

The monorepo is organized as follows:
```
/
├── be/                 # Backend (Node.js/Express)
│   ├── prisma/         # Prisma schema and migrations
│   └── src/
│       ├── controllers/
│       ├── lib/        # Socket, Prisma, Cloudinary configs
│       ├── middleware/ # Auth, Multer, Arcjet, etc.
│       ├── routes/
│       └── app.ts      # Main server entry point
└── fe/                 # Frontend (Next.js)
    └── src/
        ├── app/        # App Router pages and layouts
        ├── components/ # Reusable React components (incl. shadcn/ui)
        ├── lib/        # Axios instance, utils
        ├── store/      # Zustand stores (useAuthStore, useChatStore)
        └── middleware.ts # Route protection logic
```

---

## 💡 Architectural Decisions & Assumptions

-   **Monorepo with PNPM Workspaces:** A monorepo was chosen to streamline development and dependency management across the frontend and backend. `pnpm` workspaces are efficient, and `concurrently` provides a seamless local development experience.
-   **Prisma with PostgreSQL:** Prisma offers excellent type safety and an intuitive schema-first approach, making database interactions reliable and easy to maintain. PostgreSQL is a robust and scalable choice for a production-ready application.
-   **Zustand for State Management:** Zustand was selected for its simplicity, minimal boilerplate, and excellent performance. It is ideal for managing global state like user authentication, socket connections, and real-time chat data without the complexity of larger libraries.
-   **Real-time Layer with Socket.IO:** Socket.IO provides a reliable real-time engine with features like automatic reconnection and fallback mechanisms, which are crucial for a stable chat application.
-   **AI Integration Fallback:** I assumed that the AI API might not always be available or could incur costs during development/testing. A mock data fallback ensures the AI Insights panel remains functional and the user experience is not degraded if the external service fails.
-   **JWT in httpOnly Cookies:** Storing the JWT in an `httpOnly` cookie enhances security by preventing access from client-side JavaScript, thus mitigating XSS attacks.

---

## 📖 API Documentation

All API endpoints are prefixed with `/api`.

### Authentication (`/api/auth`)
-   `POST /signup`: Create a new user account.
-   `POST /login`: Log in an existing user.
-   `POST /logout`: Log out the current user.
-   `GET /me`: (Protected) Get the current authenticated user's profile.
-   `PUT /update`: (Protected) Update user profile (name, profile picture).

### Messaging (`/api/message`)
-   `GET /contacts`: (Protected) Get a list of all users.
-   `GET /conversations`: (Protected) Get the current user's chat history.
-   `GET /:id`: (Protected) Get messages within a conversation with a specific user.
-   `POST /send/:id`: (Protected) Send a message to another user.

### AI Insights (`/api/insights`)
-   `GET /:conversationId`: (Protected) Generate or retrieve AI insights for a specific conversation.

---

## 🤖 AI Integration Explained

**Where was it used?**
AI is integrated at the `GET /api/insights/:conversationId` endpoint. When called, the server compiles the conversation text and sends it to the Hugging Face API for analysis.

**Why was it used?**
To fulfill the core requirement of a "Smart Communication Hub," providing value beyond simple messaging by:
1.  **Summarizing Long Conversations:** Helping users quickly catch up on the context of a discussion.
2.  **Sentiment Analysis:** Offering a high-level overview of the emotional tone (Positive, Negative, Neutral) of the conversation.

**How was it implemented?**
-   The `@huggingface/inference` library was used to interact with pre-trained models.
-   **Summarization Model:** `facebook/bart-large-cnn`.
-   **Sentiment Analysis Model:** `distilbert-base-uncased-finetuned-sst-2-english`.
-   A **fallback mechanism** is in place to return mock data if the API call fails or if the `HUGGINGFACE_TOKEN` is not provided, ensuring application resilience.

---
