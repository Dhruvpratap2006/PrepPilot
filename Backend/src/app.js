const express = require('express');
const app = express();
app.set('trust proxy', 1);
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth.router');
const interviewRouter = require('./routes/interview.routes');
const { authMiddleware } = require('./middlewares/auth.middleware');

const rawClientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.trim().replace(/\/$/, "") : null;
const allowedOrigins = [
    rawClientUrl,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const normalized = origin.trim().replace(/\/$/, "");
        if (
            allowedOrigins.includes(normalized) ||
            normalized.endsWith(".onrender.com") ||
            normalized.endsWith(".vercel.app") ||
            normalized.includes("localhost") ||
            normalized.includes("127.0.0.1")
        ) {
            return callback(null, true);
        }
        return callback(null, true); // Permissive fallback to guarantee auth requests are never blocked by CORS
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// all routes
app.use("/api/auth", authRouter);
app.use("/api/interview", authMiddleware, interviewRouter);

module.exports = app;