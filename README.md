# EduQuiz - Premium Full-Stack Online Quiz & Learning Platform

EduQuiz is a professional, production-ready full-stack learning platform designed for mastering programming languages and technical assessments. The project is split into two primary components: a modern React frontend (powered by Vite and Tailwind CSS) and a robust Node.js/Express backend (backed by MongoDB).

---

## 📂 Project Structure

```
project-root/
│
├── frontend/             # React Client (Vite)
│   ├── src/
│   │   ├── assets/       # Media and static assets
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React contexts (Auth, Course, Theme)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── layouts/      # Reusable page layouts (MainLayout)
│   │   ├── pages/        # Router pages
│   │   ├── routes/       # React Router configurations
│   │   └── services/     # Axios client configuration
│   ├── public/           # Static public files
│   ├── package.json      # Frontend package configuration
│   └── vite.config.js    # Vite compiler configuration
│
├── backend/              # Node.js Express API Server
│   ├── config/           # Database and configurations
│   ├── controllers/      # Route controller handlers (Auth, Course, Favorites, Admin)
│   ├── data/             # Seeding files and mock databases
│   ├── middleware/       # Express route protection middleware
│   ├── models/           # Mongoose schemas (User, Course, Favorite, Feedback)
│   ├── routes/           # API routes definitions
│   ├── uploads/          # User upload directories
│   ├── server.js         # Entry point server script
│   └── package.json      # Backend package configuration
│
├── README.md             # Platform documentation
└── .gitignore            # Git exclusion rules
```

---

## 🛠️ Local Development Setup

To run the application locally, you will start the frontend and backend servers in separate terminals.

### 1. Backend Setup & Startup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` folder and configure it:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/quizapp
   JWT_SECRET=your_jwt_secret_key_here
   FRONTEND_URL=http://localhost:5173
   ```
4. Seed the database with mock courses, chapters, and questions:
   ```bash
   npm run seed
   ```
5. Start the backend server:
   - **Development mode (auto-reload)**:
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```
   *Note: If no local MongoDB is running, the server automatically falls back to an in-memory database mock for a seamless offline sandbox experience.*

### 2. Frontend Setup & Startup
1. Navigate to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` folder:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚀 Production Deployment Instructions

### 1. Frontend Deployment (Vercel)
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **New Project** and import your GitHub repository.
3. Configure the Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   - `VITE_API_URL` = `https://your-backend-render-url.onrender.com/api`
5. Click **Deploy**.

### 2. Backend Deployment (Render)
1. Log in to your [Render Dashboard](https://render.com).
2. Create a new **Web Service** and connect your GitHub repository.
3. Configure the Web Service:
   - **Language**: `Node`
   - **Root Directory**: `backend` (Leave empty if configuring Build/Start commands from root)
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Expand **Environment Variables** and add:
   - `NODE_ENV` = `production`
   - `PORT` = `5000` (Render handles this automatically, but set to 5000 as default fallback)
   - `MONGODB_URI` = `mongodb+srv://<username>:<password>@cluster0.mongodb.net/quizapp?retryWrites=true&w=majority` (Your MongoDB Atlas connection URI)
   - `JWT_SECRET` = `your_strong_random_jwt_secret_key`
   - `FRONTEND_URL` = `https://your-deployed-frontend.vercel.app` (For secure CORS clearance)
5. Click **Deploy Web Service**.
