module.exports = {
    SQLifyDate: (dateObj) => {
        return dateObj.toISOString().slice(0, 19).replace('T', ' ')
    }
    
}