// here we are going to add all the middlewares regarding the
// authentication and authorization of the user

// now we have to verify the token so we are going to require the jwt
const jwt = require('jsonwebtoken');
const tokenBlackListModel = require("../models/blacklist.model") // we are going to use this to check if the token is blacklisted or not

// middleware
async function authMiddleware(req, res, next) {
    // take the token from cookie
    const token = req.cookies.token;

    // if token is not present then send the status unautrhorized excess
    if(!token) {
        return res.status(401).json({
            message : "Token not provided.Unauthorized access, please login first"
        })
    }

    // first see if we get any token that token is not blacklist
    const isBlackListToken = await tokenBlackListModel.findOne({
        token // find on the basis of token
    })

    if(isBlackListToken) {
        return res.status(401).json({
            message : "Invalid token.."
        })
    }

    // if token is present then verify it
    // so first fetch the token 
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // if token is valid then attach the user info to the request object
        req.user = decodedToken;
        next();
    } catch(err) {
        return res.status(401).json({
            message : "Invalid token"
        })
    }
    
}

module.exports = { authMiddleware };