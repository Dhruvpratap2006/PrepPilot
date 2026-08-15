const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const authRouter = require('./routes/auth.router');
const interviewRouter = require('./routes/interview.routes');
const { authMiddleware } = require('./middlewares/auth.middleware');

// this import runs config/passport.js, which registers the "google"
// strategy with passport — without this, passport.authenticate("google")
// in auth.router.js would fail with "Unknown strategy 'google'"
require('../config/passport');

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// all routes
app.use("/api/auth", authRouter);
app.use("/api/interview", authMiddleware, interviewRouter);

module.exports = app;