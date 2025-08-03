```
# HuddleUp - Real-Time Video Conferencing Platform

HuddleUp is a sleek, modern, and real-time video conferencing application built with the MERN stack (MongoDB, Express, React, Node.js) and WebRTC. It features a professional user interface built with MUI (Material-UI) and offers a lightweight, performant alternative to major conferencing platforms.

**Motto:** "Connect, Collaborate, Contribute or just Chat and Chill"

---

## Features

- **Secure User Authentication:** A robust registration and login system using JSON Web Tokens (JWT) for secure, stateless sessions.
- **Modern Material Design UI:** A beautiful and responsive dark-themed interface built with MUI, ensuring a professional and consistent user experience.
- **Real-Time Video & Audio:** High-quality, low-latency media streaming powered by a WebRTC peer-to-peer architecture.
- **Ephemeral Meeting Rooms:** Instantly create unique, temporary meeting rooms that are automatically disposed of after the call.
- **Live Chat:** A real-time chat sidebar integrated into the meeting room, with auto-scrolling.
- **Screen Sharing:** Seamlessly share your screen with other participants in the call.
- **Intuitive Media Controls:** Easily toggle your camera and microphone on or off with a floating control bar and clear Material Design icons.

## Tech Stack

The project is a monorepo containing two main packages: `backend` and `frontend`.

### Backend

| Technology | Description |
| --- | --- |
| **Node.js** | JavaScript runtime for the server. |
| **Express.js** | Web application framework for building the REST API. |
| **MongoDB** | NoSQL database for storing user accounts. |
| **Mongoose** | Object Data Modeling (ODM) library for MongoDB. |
| **Socket.IO** | Library for real-time, bidirectional signaling between clients. |
| **JSON Web Token (JWT)**| Industry standard for creating secure access tokens. |
| **bcrypt** | A library to help you hash passwords. |
| **dotenv** | Loads environment variables from a `.env` file. |

### Frontend

| Technology | Description |
| --- | --- |
| **React.js (v19)** | A JavaScript library for building user interfaces. |
| **Vite** | Next-generation frontend tooling for a fast development experience. |
| **MUI (Material-UI)** | A comprehensive component library for building a professional UI. |
| **@emotion/react & styled** | The default styling engine for MUI. |
| **@mui/icons-material** | Provides Material Design icons for the UI. |
| **React Router DOM** | Client-side routing for the single-page application. |
| **Socket.IO Client** | Client-side library to connect to the Socket.IO server. |
| **PeerJS** | A library that simplifies WebRTC peer-to-peer connections. |
| **uuid** | For generating unique, client-side meeting room IDs. |
| **React Context API** | For managing global authentication state. |

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running on your local machine, or a MongoDB Atlas connection string.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### 1. Clone the Repository

```
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
```

### 2. Set Up the Backend

Navigate to the backend directory and install the necessary dependencies.

```
cd backend
npm install
```

Next, create an environment file to store your sensitive credentials.

1.  Create a file named `.env` in the `backend` directory.
2.  Add the following variables to the `.env` file. **Be sure to replace the placeholder values with your own.**

    ```
    # .env file for the backend

    # Your MongoDB connection string (local or from a cloud provider like Atlas)
    MONGO_URI="mongodb://127.0.0.1:27017/huddleup"

    # A long, random, and secret string for signing JWTs
    JWT_SECRET="your-super-long-and-secret-jwt-key-here"

    # The expiration time for JWTs (e.g., "1d", "7d", "2h")
    JWT_EXPIRES_IN="1d"
    ```

### 3. Set Up the Frontend

In a new terminal window, navigate to the frontend directory and install its dependencies.

```
cd frontend
npm install
```

## Running the Application

You will need to have two separate terminals running simultaneously to start both the backend and frontend servers.

1.  **Start the Backend Server:**
    In your first terminal, from the `backend` directory, run:
    ```
    npm run dev
    ```
    Your backend server should now be running, typically on `http://localhost:8000`.

2.  **Start the Frontend Development Server:**
    In your second terminal, from the `frontend` directory, run:
    ```
    npm run dev
    ```
    Your React application will start, and your browser should automatically open to the site, typically `http://localhost:5173`.

You can now register a new user, log in, and start using the application! To test a video call, open a second browser window (or a private/incognito window) and have another user join the same room.
```