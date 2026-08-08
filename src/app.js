const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
// require all the routes here
const authRouter = require('./routes/auth.router');

app.use(express.json());
app.use(cookieParser());

// now if we want to send request to any auth releated api
// then we have to add the prefix /api/auth in all auth releated apis


app.use("/api/auth", authRouter);

module.exports = app;