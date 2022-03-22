const { isNull, isUndefined } = require('lodash');
const { returner } = require('./util');

let verifyAuth = async (req, res, next) => {
    const jwt = require('./jwt');
    const authheader = req.headers['authorization'];

    var token = authheader && authheader.split(' ')[1];

    if (isNull(token) || isUndefined(token)) return res.status(401).send(returner({ message: 'Access forbidden.' }));

    token = token.replace('"', '');

    try {
        let payload = jwt.verify(token);

        req.user = payload;

        return next();
    } catch (error) {
        return res.status(401).send(returner({ message: 'Cannot authenticate user. Malformed Auth token.' }));
    }
}

/* Verify if a user exist in the DB OR is "active" */
let userStatus = async (req, res, next) => {
    const UserController = require('../controllers/UserController');

    let user = await UserController.get(req.user);

    user = user != false ? user.toJSON() : user;

    if (user != false && (user.active == true || user.active == 1)) return next();
    if (user == false) return res.status(401).send(returner({ message: 'User does not exist.' }));
    return res.status(401).send(returner({ message: 'User account not activated. Please check your emails to activate your account.' }));
}

module.exports = {
    verifyAuth,
    userStatus
}