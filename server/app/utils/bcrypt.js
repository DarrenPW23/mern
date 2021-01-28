const bcrypt = require("bcrypt")

module.exports = {
    hash: (payload = '') => {
        return new Promise((res, rej) => {
            bcrypt.hash(payload, 10, (err, hash) => {
                if (err) return rej(err)
    
                return res(hash)
            })
        })
    },
    compare: (password, hashedpassword) => {
        return new Promise((res, rej) => {
            bcrypt.compare(password, hashedpassword, (err, response) => {
                if (err) return rej(err)
    
                if (response !== true) return rej({ success: false, message: 'Incorrect password supplied.' })
    
                return res({ success: true, data: { password: hashedpassword } })
            })
        })
    }
}