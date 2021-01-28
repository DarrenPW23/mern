module.exports = {
    returner: (args = {}) => {
        return {
            success: args.success || false,
            message: args.message || 'An error has occurred',
            data: args.data || [],
            errors: args.errors || {}
        }
    }
}