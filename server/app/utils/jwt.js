const jwt = require('jsonwebtoken')

module.exports = {
    signJWT: (payload = {}) => {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
    },
    verifyJWT: (token, callback) => {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => callback(err, user))
    }
}