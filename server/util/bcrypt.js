const bcrypt = require("bcrypt")

const hash = async (payload = '') => {
    return await bcrypt.hash(payload, 10)
}

const compare = async (password, hashedpassword) => {
    return await bcrypt.compare(password, hashedpassword)
}

module.exports = {
    hash,
    compare
}