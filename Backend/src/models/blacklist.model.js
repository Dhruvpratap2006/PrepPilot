// Token blacklisting: when a user logs out, we want their token to 
// become unusable immediately, even though the JWT itself is technically
// still valid until it expires. So we store the logged-out token in a 
// blacklist. On every future request, we check if the incoming token 
// exists in the blacklist — if it does, we reject the request with 
// 401 Unauthorized, even if the token's signature is otherwise valid.

const mongoose = require('mongoose');

const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token is required to be added in blackList"]
    }
},
    {
        timestamps: true,
    })


const tokenBlackListModel = mongoose.model("blackListTokens", blackListTokenSchema)

module.exports = tokenBlackListModel