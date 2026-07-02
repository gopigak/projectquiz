# Online Quiz & Learning Platform

Welcome to the Online Quiz & Learning Platform! This project is built using a modern stack: React with Vite and TailwindCSS for the frontend, and Node.js with Express and MongoDB for the backend.

It is fully prepared for unified, single-server production deployment (the Express backend serves the React frontend static build).

---

## 🛠️ Local Development

### 1. Install Dependencies
Run from the root directory (this installs both frontend and backend dependencies):
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/quizapp
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Run Development Servers
Start both the React development server and the Express backend:
- **Frontend** (Vite on [http://localhost:5173](http://localhost:5173)):
  ```bash
  npm run dev
  ```
- **Backend** (Express on [http://localhost:5000](http://localhost:5000)):
  ```bash
  npm run dev --prefix backend
  ```

### 4. Seed Mock Data (Optional)
To populate the database with courses, lessons, and questions:
```bash
npm run seed --prefix backend
```

---

## 🚀 Deployment & Hosting Guidelines

This fullstack application is configured to run as a single unified service. The backend server automatically serves the compiled frontend assets (`dist/` directory) and maps client-side React routes.

### Required Environment Variables
Configure these variables in your hosting provider's dashboard:
- `NODE_ENV`: Set to `production` (tells the backend to build and serve static files).
- `MONGO_URI`: Your MongoDB database connection string (e.g., MongoDB Atlas).
- `JWT_SECRET`: A secure key for encoding JWT authentication tokens.
- `PORT`: Set automatically by platforms like Render/Railway/Heroku.

### Option 1: Render Deployment (Web Service)
1. Log in to [Render](https://render.com/) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add the required Environment Variables in the **Environment** tab.
5. Deploy! Render will build the frontend assets, install backend dependencies, and run the Express app.

### Option 2: Railway Deployment
1. Log in to [Railway](https://railway.app/) and start a new project.
2. Select **Deploy from GitHub repo** and connect your repository.
3. Railway will automatically detect the root `package.json`.
4. Set the Environment Variables (`NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`).
5. Railway uses the standard scripts and will start the server using the root `npm start` script.

### Option 3: VPS / Manual Server Hosting
To build and run the production application manually:
```bash
# 1. Install all dependencies
npm install

# 2. Build the React frontend
npm run build

# 3. Start the server in production mode
NODE_ENV=production PORT=8080 node backend/server.js
```
The site will be hosted on port `8080` (or whichever port you specify).
