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
const OptimizeCssAssetsPlugin   = require('optimize-css-assets-webpack-plugin')


function viewsToHtml(site) {
    let templateFiles = glob.sync(path.resolve(__dirname, '..', 'frontend', site, 'views') + '/**/*.pug')

    // Filter out .pug templates that start with underscore (_)
    templateFiles = templateFiles.filter(templateFile => {
        if(path.basename(templateFile).charAt(0) === '_') {
            return false
        }

        return true
    })

    return templateFiles.map(templateFile => {
        let outTemplate = `${site}${templateFile.substr(templateFile.lastIndexOf('/views/'))}`
        outTemplate = outTemplate.replace(/\.pug$/, '.html')

        return new HtmlWebpackPlugin({
            template: templateFile,
            filename: outTemplate,
            chunks: [ site ],
            minify: false
        })
    })
}


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
                test: /\.pug$/,
                use: [
                    {
                        loader: 'pug-loader',
                        options: {
                            pretty: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|svg|ico)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: (resourcePath, resourceQuery) => {
                                const filename = path.basename(resourcePath)

                                if(filename === 'favicon.ico') {
                                    // No hash for favicon.ico
                                    return '[name].[ext]'
                                }

                                return '[name]-[contenthash].[ext]'
                            },
                            outputPath: (url, resourcePath, context) => {
                                // Strip /frontend/ from path and place into dist/
                                const outputPath = resourcePath.substr(resourcePath.lastIndexOf('/frontend/') + 10)
                                const outputDir  = path.dirname(outputPath)
                                return path.join(outputDir, url)
                            },
                            publicPath: (url, resourcePath, context) => {
                                // Strip /frontend/ from path
                                let outputPath = resourcePath.substr(resourcePath.lastIndexOf('/frontend/') + 10)
                                // Strip first directory
                                outputPath = outputPath.substr(outputPath.indexOf('/'))
                                const publicPath = path.dirname(outputPath)
                                return path.join(publicPath, url)
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

    resolve: {
        alias: {
            FRONTEND: path.resolve(__dirname, '..', 'frontend')
        }
    },

    entry: {
        unnodejs: './frontend/unnodejs/src/unnodejs.js',
        nurminendev: './frontend/nurminendev/src/nurminendev.js'
    },

    output: {
        filename: 'js/[name]-[contenthash].bundle.js',
        path: path.resolve(__dirname, '..', 'dist'),
        publicPath: '/'
    },

    plugins: [
        new CleanWebpackPlugin({ // Cleanup /dist folder before each build
            cleanStaleWebpackAssets: false,
        }),

        new MiniCssExtractPlugin({
            filename: 'css/[name]-[contenthash].bundle.css'
        }),
    ]
    .concat(viewsToHtml('unnodejs'))
    .concat(viewsToHtml('nurminendev')),

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
