const app = require('./bin/init')
const path = require('path')

const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('../webpack.config')

app.use(webpackMiddleware(webpack(webpackConfig)))

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});