/* models */
const User = require('../models/UserModel')
const roles = require('../models/RolesModel')

/* utils */
const { verifyJWT } = require('../utils/jwt')
const { returner } = require('../utils/util')

module.exports = {
    authJWT: (req, res, next) => {
        const authheader = req.headers['authorization']
        const token = authheader && authheader.split(' ')[1]

        if (token == null) return res.status(401).send(returner({ message: 'You are not authorized to access this resource.'}))

        verifyJWT(token, (err, user) => {
            if (err || typeof user.ID === 'undefined') return res.status(403).send({ message: 'Invalid request received.', errors: err })

            User.select().where({ ID: user.ID }).execute()
                .then(users => {
                    if (users.length < 1) return res.status(403).send(returner({ message: 'Your user account has been deactivated or removed. Please contact system admin.' }))

                    users = users.map(r => {
                        r.role = roles.find(ro => ro.name == r.role)
                        return r
                    })
        
                    user = users[0]

                    req.user = user

                    next()
                })
                .catch(err => res.sendStatus(403))
        })
    },
    authUser: (req, res, next) => {
        if (req.user == null || typeof req.user === 'undefined') return res.status(403).send(returner({ message: 'You are not authorized to access this resource.' }));

        return next()
    }
}