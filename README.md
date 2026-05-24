<div align="center">
  <h1>CodePilot</h1>
  <p><strong>AI-Powered Code Review & Fixing Assistant</strong></p>

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
  ![Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
</div>

<br />

## Short Description
CodePilot is an advanced web application that leverages the Google Gemini AI API to provide real-time code reviews and automated code fixing. Built with a modern React/Vite frontend and a secure Node.js/Express backend, it helps developers write cleaner, optimized, and bug-free code across multiple programming languages.

---

## Features
- **🤖 AI Code Review:** Get detailed feedback, quality ratings, and suggested improvements.
- **🛠️ AI Code Fixing:** Automatically fix syntax errors, logical bugs, and unoptimized code.
- **🌍 Multi-Language Support:** Supports 20+ programming languages (JavaScript, Python, Java, C++, Rust, Go, etc.).
- **🌗 Dark / Light Mode:** Fully themed UI for a comfortable coding experience.
- **📱 Responsive UI:** Optimized layout for desktop, tablet, and mobile.
- **📋 One-Click Copy:** Seamlessly copy generated code blocks with visual feedback.
- ** Secure API:** Gemini API keys are safely hidden within the backend server.

---

## Tech Stack
**Frontend:**
- React 19 + Vite
- Tailwind CSS (v4)
- Monaco Editor (for rich code editing)
- React Markdown (for parsing AI responses)
- Lucide React (for icons)

**Backend:**
- Node.js
- Express.js
- Axios
- CORS & dotenv

---

## Folder Structure

```text
codepilot/
├── frontend/             # React + Vite application
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json       # Vercel deployment config
│
├── backend/              # Express server
│   ├── controllers/      # Business logic & AI prompts
│   ├── routes/           # API endpoints
│   ├── server.js         # Entry point & CORS setup
│   └── package.json
│
└── README.md
```

---

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/codepilot.git
cd codepilot
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Backend Setup
```bash
cd ../backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```

---

## Run Locally

Open two separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

---

## Deployment

### Backend (Render)
1. Push your code to GitHub.
2. Go to [Render](https://render.com/) and create a **New Web Service**.
3. Connect your repository and select the `backend` directory as the Root Directory.
4. Set Build Command to `npm install` and Start Command to `npm start`.
5. Add your Environment Variables (`GEMINI_API_KEY` and `FRONTEND_URL`).
6. Click **Deploy**.

### Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/) and create a **New Project**.
2. Import your repository and select the `frontend` directory as the Root Directory.
3. Vercel will auto-detect Vite settings (Build: `npm run build`, Output: `dist`).
4. Add the Environment Variable `VITE_API_URL` pointing to your deployed Render backend URL (e.g., `https://your-backend.onrender.com`).
5. Click **Deploy**.

*(Note: Once Vercel provides your live frontend URL, update the `FRONTEND_URL` variable in your Render backend settings so CORS allows the requests.)*

## 🔮 Future Improvements
- [ ] User authentication & history tracking.
- [ ] Support for multiple files / folder uploads.
- [ ] Integration with GitHub to directly review pull requests.
- [ ] Custom system prompt adjustments via settings.

---

## Author
**Your Name**  
- [GitHub](https://github.com/yourusername)
- [LinkedIn](https://linkedin.com/in/yourusername)
- [Portfolio](https://yourwebsite.com)

---
<div align="center">
  <i>If you find this project helpful, please consider leaving a ⭐ on the repository!</i>
</div>
=======
# CodePilot
CodePilot: AI-powered code review and code fixing platform built with React, Node.js, Express, and Gemini API.
