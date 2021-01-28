const Validator = require('validator')
const { isEmpty, isNull } = require('lodash')

let login = (data) => {
    let errors = {}

    if (isNull(data.username) || data.username === '') errors.identifier = 'This field is required'
    if (isNull(data.password) || data.password === '') errors.password = 'This field is required'

    return { errors, isValid: isEmpty(errors) }
}

let register = (data) => {
    let errors = {}

    if (isNull(data.username) || data.username === '') errors.username = 'This field is required'
    if (isNull(data.email) || data.email === '') errors.email = 'This field is required'
    if (!Validator.isEmail(data.email)) errors.email = 'Email is invalid'
    if (isNull(data.password) || data.password === '') errors.password = 'This field is required'

    if (isNull(data.repeat_password) || data.repeat_password === '') errors.repeat_password = 'This field is required'
    if (!Validator.equals(data.password, data.repeat_password)) errors.repeat_password = 'Passwords must match'

    return { errors, isValid: isEmpty(errors) }
}

module.exports = {
    login,
    register
}