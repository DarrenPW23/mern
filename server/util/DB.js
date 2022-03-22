const knexfile = require('../knexfile');

var dbConfig = {};
var { ENV } = process.env;

dbConfig = knexfile[ENV]

// Setting up the database connection
const knex = require('knex')(dbConfig)

const Bookshelf = require('bookshelf')(knex)

module.exports = Bookshelf;