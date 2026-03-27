# Connectra

Connectra is a full-stack video meeting web application with authentication, real-time room management, participants list, in-meet chat, and Agora-based audio/video communication.

## Features

- User registration and login with JWT authentication
- Create instant or scheduled meetings
- Join meetings using room code
- Real-time participant updates for all users in the room
- In-meet chat with sender names
- Audio/video controls (mute, camera toggle)
- Screen sharing and local meeting recording
- Responsive UI with modern landing page design

## Tech Stack

### Frontend

- React 18
- React Router v6
- Socket.IO Client
- Bootstrap + React-Bootstrap
- Material UI Icons
- Agora RTC SDK

### Backend

- Node.js + Express
- Socket.IO
- MongoDB + Mongoose
- JWT + bcrypt

## Repository Structure

- `client/` - React frontend
- `server/` - Express + Socket.IO backend

## Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB running locally (`mongodb://localhost:27017/meet-app`)

## Environment Variables

Create a `.env` file in `server/`:

```env
JWT_SECRET=your_strong_secret_here
```

If not set, the server falls back to a local development default.

## Installation

From the repository root:

```bash
cd server
npm install

cd ../client
npm install
```

## Running the App

Run backend:

```bash
cd server
npm run dev
```

Run frontend (in a new terminal):

```bash
cd client
npm run dev
```

Note: `npm run dev` in `client/` is mapped to `react-scripts start`.

## Default Ports

- Frontend: `http://localhost:3000`
- Backend/API/Socket: `http://localhost:6001`

## Auth API Endpoints

Base URL: `http://localhost:6001/auth`

- `POST /register`
- `POST /login`

## Common Issues

### 1) `npm run dev` fails in client

Use `npm install` first in `client/`, then run:

```bash
npm run dev
```

### 2) Create Meet does nothing

Make sure backend is running on port `6001` and MongoDB is up.

### 3) Cannot see participants list updates

All participants are now broadcast room updates on join/leave. Ensure both client and server are running latest code.

## Future Improvements

- Deploy frontend and backend
- Add production-ready environment configs
- Add unit/integration tests
- Add role-based meeting permissions

## License

This project is for educational and development purposes.

## Some Screen Shots 
<img width="1919" height="913" alt="Screenshot 2026-03-27 143545" src="https://github.com/user-attachments/assets/4d712c87-e5df-4e84-b1ae-72e4425fe737" />
<img width="1919" height="913" alt="Screenshot 2026-03-27 143622" src="https://github.com/user-attachments/assets/9087eb59-c9f5-4160-a917-5baea2d28bb6" />
<img width="1919" height="908" alt="Screenshot 2026-03-27 143740" src="https://github.com/user-attachments/assets/3712a1a6-138e-43e3-bcaa-b8ce33391987" />
<img width="389" height="817" alt="Screenshot 2026-03-27 143805" src="https://github.com/user-attachments/assets/3637991e-f744-46e7-93c7-50c93fa5a0df" />
<img width="224" height="799" alt="Screenshot 2026-03-27 154208" src="https://github.com/user-attachments/assets/0af011fe-a810-4d7e-941a-c84f0cb4b7bc" />

<img width="1918" height="911" alt="Screenshot 2026-03-27 160317" src="https://github.com/user-attachments/assets/ffc30d0d-addf-48af-b098-947b266afb45" />

