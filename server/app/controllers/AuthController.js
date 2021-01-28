const router = require('express').Router();

/* MIDDLEWARE */
const { authJWT, authUser } = require('../middleware/auth')

/* MODELS */
const UserModel = require('../models/UserModel')
const roles = require('../models/RolesModel')

/* UTILS */
const validator = require('../utils/validators')
const { returner } = require('../utils/util')
const { compare, hash } = require('../utils/bcrypt')
const { signJWT } = require('../utils/jwt')

router.post('/login', (req, res) => {
    let validated = validator.login(req.body)
    if (!validated.isValid) return res.status(403).json(returner({ errors: validated.errors }));

    UserModel.select().where({ username: req.body.username }).execute()
        .then(users => {
            if (users.length < 1) return res.json(returner({ message: 'No such a user exists.' }));

            users = users.map(r => {
                r.role = roles.find(ro => ro.name == r.role)
                return r
            })

            let user = users[0]

            compare(req.body.password, user.password)
                .then(result => {
                    if (!result.success) return res.json(returner(result));

                    req.user = user

                    return res.json(returner({
                        success: true,
                        message: 'Log in successful.',
                        data: { accessToken: signJWT({ ID: user.ID }) }
                    }));
                })
                .catch(err => res.send(err))
        })
        .catch(err => res.send(err))
})

router.post('/register', (req, res) => {
    let validated = validator.register(req.body)
    if (!validated.isValid) return res.status(403).json(returner({ errors: validated.errors }));

    let user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }

    UserModel.select().where({ username: user.username }).execute()
        .then(users => {
            if (users.length > 0) return res.send(returner({ 'message': 'Cannot register new user', errors: { username: 'This username is already taken.' } }));

            UserModel.select().where({ email: user.email }).execute()
                .then(users => {
                    if (users.length > 0) return res.send(returner({ 'message': 'Cannot register new user', errors: { email: 'A user with this email has already subscribed.' } }));

                    hash(user.password)
                        .then(hash => {
                            user.password = hash

                            UserModel.insert(user).execute()
                                .then(result => {
                                    if (result.affectedRows === 0) return res.json(returner({ message: 'Failed to register new account. Please try again later' }))
                                    let rolefield = UserModel.fields.find(ro => ro.name == 'role')
                                    let role = rolefield.default || 'user'

                                    user.ID = result.insertID
                                    user.role = roles.find(ro => ro.name == role)

                                    console.log(user)

                                    return res.json(returner({
                                        success: true,
                                        message: 'Registration successful.',
                                        data: { accessToken: signJWT({ ID: user.ID }) }
                                    }));
                                })
                                .catch(err => res.send(err))
                        })
                        .catch(err => res.send(err))
                })
                .catch(err => res.send(err))
        })
        .catch(err => res.send(err))
})

router.get('/user', authJWT, authUser, (req, res) => {
    console.log(req.user)
    return res.send(req.user)
})

module.exports = router