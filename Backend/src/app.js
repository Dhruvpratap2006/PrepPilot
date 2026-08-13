const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth.router');
const interviewRouter = require('./routes/interview.routes');
const { authMiddleware } = require('./middlewares/auth.middleware');


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// all routes
app.use("/api/auth", authRouter);
app.use("/api/interview", authMiddleware, interviewRouter);

module.exports = app;