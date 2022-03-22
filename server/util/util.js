module.exports = {
    returner: (args = {}) => {
        return {
            success: args.success || false,
            message: args.message || 'An error has occurred',
            data: args.data || [],
            errors: args.errors || {}
        }
    },
    isNumber: (arg) => {
        if (typeof arg != "string") return false // we only process strings!  
        return !isNaN(arg) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(arg)) // ...and ensure strings of whitespace fail
    },
    isDate: (arg) => {
        if (typeof arg != "string") return false // we only process strings!
        return !isNaN(Date.parse(arg))
    },
    SQLifyDate: (dateObj) => {
        // dateObj = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60 * 1000)) // convert to local time
        return dateObj.toISOString().slice(0, 19).replace('T', ' ')
    }
}