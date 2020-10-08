//
//
// my-websites
//
// Copyright (c) 2020 Riku Nurminen
//
// All rights reserved by me. :)
//
//


const path                      = require('path')
const glob                      = require('glob')

const { CleanWebpackPlugin }    = require('clean-webpack-plugin')
const HtmlWebpackPlugin         = require('html-webpack-plugin')
const MiniCssExtractPlugin      = require('mini-css-extract-plugin')
const TerserJSPlugin            = require('terser-webpack-plugin')
const CssMinimizerPlugin        = require('css-minimizer-webpack-plugin')
const HtmlWebpackPugPlugin      = require('html-webpack-pug-plugin')


function getPugTemplates() {
    const templateFiles = glob.sync(path.resolve(__dirname, '..', 'frontend', 'views') + '/**/*.pug')
    return templateFiles.map(templateFile => {
        const outTemplate = `../${templateFile.substr(templateFile.lastIndexOf('views'))}`

        return new HtmlWebpackPlugin({
            template: templateFile,
            filename: outTemplate,
        })
    })
}

const htmlPlugins = getPugTemplates()


module.exports = {

    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [["@babel/preset-env", { "targets": "defaults" }]]
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
            },
        ]
    },

    entry: {
        app: './frontend/src/app.js',
        print: './frontend/src/print.js'
    },

    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '..', 'dist', 'assets'),
        publicPath: '/assets'
    },

    plugins: [
        new CleanWebpackPlugin({ // Cleanup /dist folder before each build
            dry: true,
            cleanOnceBeforeBuildPatterns: [path.join(__dirname, '../dist/**/*')], // Parent dir of output.path
            dangerouslyAllowCleanPatternsOutsideProject: true
        }),

        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ]
    .concat(htmlPlugins)
    .concat(new HtmlWebpackPugPlugin()),

    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        minimizer: [
            new TerserJSPlugin({
                extractComments: false
            }),
            new CssMinimizerPlugin(),
        ],
    }

}
