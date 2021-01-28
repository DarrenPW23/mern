const mysql = require('mysql')
const util = require('util')

let config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
}

let makeDb = () => {
    const con = mysql.createConnection(config)

    return {
        query(sql, args) {
            return util.promisify(con.query).call(con, sql, args)
        },
        close() {
            return util.promisify(con.end).call(con)
        }
    }
}

module.exports = makeDb()