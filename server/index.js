const express = require('express')
const path = require('path')
const webpack = require('webpack')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackDevMiddleware = require('webpack-dev-middleware')

const port = process.env.PORT || 3000

require('dotenv').config()

let webpackConfig = require('../webpack.config')

webpackConfig.entry.unshift('webpack-hot-middleware/client')
webpackConfig.mode = 'development'

console.log(webpackConfig)

const app = express()
const compiler = webpack(webpackConfig)

app.use(webpackDevMiddleware(compiler))
app.use(webpackHotMiddleware(compiler))

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
})