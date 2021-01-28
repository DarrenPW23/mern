const path = require('path')

module.exports = {
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, './client')
    },
    entry: path.resolve(__dirname, './client/index.js'),
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: 'babel-loader'
            }
        ]
    }
}