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
const HtmlWebpackPugPlugin      = require('html-webpack-pug-plugin')
const OptimizeCssAssetsPlugin   = require('optimize-css-assets-webpack-plugin')

function getPugTemplates() {
    const templateFiles = glob.sync(path.resolve(__dirname, '..', 'frontend', 'views') + '/**/*.pug')
    return templateFiles.map(templateFile => {
        const outTemplate = `./${templateFile.substr(templateFile.lastIndexOf('views'))}`

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
                test: /.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'sass-loader', options: { sourceMap: true } }
                ],
            },
            {
                test: /\.(png|jpe?g|svg|ico)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // Just load all images into assets/images
                            outputPath: (url, resourcePath, context) => {
                                return `assets/${resourcePath.substr(resourcePath.lastIndexOf('frontend/images') + 9)}`
                            }
                        },
                    },
                    //{
                    //    loader: 'image-webpack-loader'
                    //}
                ]
            },
        ]
    },

    entry: {
        app: './frontend/src/app.js'
    },

    output: {
        filename: 'assets/js/[name].bundle.js',
        path: path.resolve(__dirname, '..', 'dist'),
        publicPath: '/'
    },

    plugins: [
        new CleanWebpackPlugin({ // Cleanup /dist folder before each build
            cleanStaleWebpackAssets: false,
        }),

        new MiniCssExtractPlugin({
            filename: 'assets/css/[name].css',
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
            new OptimizeCssAssetsPlugin({
                cssProcessorOptions: {
                    map: {
                        inline: false,
                        annotation: true,
                    }
                }
            })
        ]
    }

}
