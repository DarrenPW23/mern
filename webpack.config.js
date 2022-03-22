const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

module.exports = {
    entry: [
        path.resolve(__dirname, './client/index.js')
    ],
    output: {
        path: path.resolve(__dirname, './public'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ],
            },
            {
                test: /\.html$/i,
                use: {
                    loader: "html-loader"
                }
            }
        ]
    },
    devServer: {
        port: process.env.PORT || 3010,
        watchContentBase: true,
        contentBase: path.resolve(__dirname, './client')
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({ filename: "bundle.css" }),
        new HtmlWebPackPlugin({ template: './client/index.html', inject: 'body' })
    ]
}