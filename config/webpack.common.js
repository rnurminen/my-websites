const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    module: {
        rules: [
            {
                test: /\.pug$/,
                use: [
                    {
                        loader: "pug-loader",
                        options: {
                            pretty: true
                        }
                    }
                ]
            }
        ]
    },
    entry: {
        app: './frontend/src/app.js',
        print: './frontend/src/print.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '..', 'dist'),
        publicPath: '/'
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!.keep']
        }), // Cleans up the above 'output.path' folder before each build

        // Static pages (.html) files served by our webserver
        // Compiled from .pug view templates via pug-loader
        new HtmlWebpackPlugin({
            template: './frontend/views/index.pug',
            filename: 'index.html',
            chunks: ['app']
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
}