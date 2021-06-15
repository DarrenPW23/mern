const express = require('express')
const path = require('path')
const port = process.env.PORT || 3000
const app = express()

const yargs = require('yargs');

const PRODUCTION = !!(yargs.argv.production);

global.INDEXROUTE = path.join(__dirname, `../${PRODUCTION ? 'public/' : 'client/'}index.html`)

require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (!PRODUCTION) { // For Development. Compile on-the-go
    const webpack = require('webpack')
    const webpackHotMiddleware = require('webpack-hot-middleware')
    const webpackDevMiddleware = require('webpack-dev-middleware')

    let webpackConfig = require('../webpack.config')
    webpackConfig.mode = 'development'

    const compiler = webpack(webpackConfig)
    app.use(webpackDevMiddleware(compiler))
    app.use(webpackHotMiddleware(compiler))
} else { // for Production. Should already be compiled
    app.use(express.static(path.join(__dirname, '../public'))); // public folder
}

app.listen(port, () => {
    console.log(`Server started on ${port}`)
})

app.on('error', (err) => {
    if (err.syscall !== 'listen') throw err

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port

    // handle specific listen errs with friendly messages
    switch (err.code) {
        case 'EACCES':
            console.err(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.err(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw err
    }
})

module.exports = app