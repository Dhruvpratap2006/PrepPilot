const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth.router');

// CORS sabse pehle - routes se upar
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ab routes
app.use("/api/auth", authRouter);

module.exports = app;