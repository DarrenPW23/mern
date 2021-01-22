import path from 'path'

export default {
    // devtools: 'eval-source-map',
    entry: path.join(__dirname, '/client/index.js'),
    output: {
        path: '/'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: path.join(__dirname, 'client'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.jsx', '.js']
    }
}