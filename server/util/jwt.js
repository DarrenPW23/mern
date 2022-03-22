const jwt = require('jsonwebtoken')

module.exports = {
    sign: (payload = {}) => {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
    },
    verify: (token) => {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    }
}