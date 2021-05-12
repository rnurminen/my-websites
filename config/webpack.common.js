//
//
// my-websites
//
// Copyright (c) 2020, 2021 Riku Nurminen
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.
//
//


const path                      = require('path')
const glob                      = require('glob')

const { CleanWebpackPlugin }    = require('clean-webpack-plugin')
const HtmlWebpackPlugin         = require('html-webpack-plugin')
const MiniCssExtractPlugin      = require('mini-css-extract-plugin')
const CssMinimizerPlugin        = require('css-minimizer-webpack-plugin')
const TerserJSPlugin            = require('terser-webpack-plugin')
const HtmlBeautifyPlugin        = require('@nurminen/html-beautify-webpack-plugin')
const VueLoaderPlugin           = require('vue-loader/lib/plugin')


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

        page = path.basename(templateFile).replace(/\.pug$/, '')

        let options = {
            template: templateFile,
            filename: outTemplate,
            chunks: [ site ],
            minify: false,
            isProduction: (process.env.NODE_ENV === 'production')
        }

        if(site === 'unnodejs' && page === 'getting-started') {
            options.chunks.push('codehighlight')
        } else if(site === 'unnodejs' && page === 'configuration') {
            options.chunks.push('codehighlight')
        } else if(site === 'unnodejs' && page === 'process-clustering') {
            options.chunks.push('codehighlight')
        } else if(site === 'unnodejs' && page === 'vhosts') {
            options.chunks.push('codehighlight')
        } else if(site === 'unnodejs' && page === 'logging') {
            options.chunks.push('codehighlight')
        } else if(site === 'nurminendev' && page === 'contact') {
            options.chunks.push('bulmamodalfx')
        } else if(site === 'nurminendev' && page === 'about') {
            options.chunks.push('bulmamodalfx')
        } else if(site === 'unnodejs' && templateFile.includes('unnodejs/views/index.pug')) {
            options.isFrontPage = true
        }

        return new HtmlWebpackPlugin(options)
    })
}


module.exports = {

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    "targets": "defaults",
                                    "useBuiltIns": "usage",
                                    "corejs": { 'version': '3.8' }
                                }
                            ]
                        ]
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
                        loader: '@phacks/pug-loader',
                        options: {
                            pretty: true,
                            self: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|svg|ico|pdf)$/i,
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
                                // Strip first directory (unless it's a shared image)
                                if(outputPath.includes('shared/')) {
                                    outputPath = '/' + outputPath
                                } else {
                                    outputPath = outputPath.substr(outputPath.indexOf('/'))
                                }
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
            FRONTEND: path.resolve(__dirname, '..', 'frontend'),
            'vue$': 'vue/dist/vue.esm.js'
        }
    },

    entry: {
        unnodejs: './frontend/unnodejs/js/unnodejs.js',
        nurminendev: './frontend/nurminendev/js/nurminendev.js',

        codehighlight: './frontend/shared/js/codehighlight.js',
        bulmamodalfx: './frontend/shared/js/bulma-modal-fx.js'
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

        new VueLoaderPlugin(),
    ]

    .concat(viewsToHtml('unnodejs'))
    .concat(viewsToHtml('nurminendev'))

    .concat(new HtmlBeautifyPlugin({
        config: {
            html: {
                end_with_newline: true,
                indent_size: 2,
                indent_with_tabs: false,
                indent_inner_html: true,
                extra_liners: ''
            }
        },
    })),

    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        minimizer: [
            new TerserJSPlugin({
                extractComments: false
            }),
            new CssMinimizerPlugin({
                sourceMap: true
            })
        ]
    }

}
