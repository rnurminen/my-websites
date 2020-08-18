//
//
// nurminen-dev-platform - A NodeJS/Express development and testing playground
//
// Copyright (c) 2020 Riku Nurminen
//
// https://www.nurminen.dev
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


'use strict'

require('dotenv').config()

const path              = require('path')
const http              = require('http')
const https             = require('https')
const httpTerminator    = require('http-terminator')
const express           = require('express')
const app               = express()
const helmet            = require('helmet')
const chalk             = require('chalk')

const logger            = require('@bit/nurminendev.utils.logger').workerLogger
const util              = require('@bit/nurminendev.utils.miscutils')
const handle            = util.handle

const webpack               = process.env.NODE_ENV !== 'production' ? require('webpack') : null
const webpackDevMiddleware  = process.env.NODE_ENV !== 'production' ? require('webpack-dev-middleware') : null
const webpackConfig         = process.env.NODE_ENV !== 'production' ? require('./config/webpack.dev.js') : null
const webpackCompiler       = process.env.NODE_ENV !== 'production' ? webpack(webpackConfig) : null


class ServerWorker {
    constructor() {
        this.serverQuitting = false

        this.serverInsecure = null
        this.serverSSL = null

        this.httpTerminator = null
        this.httpsTerminator = null

        this.webpackDevMiddleware = null
    }


    async setupServer() {
        process.on('message', (message) => {
            if (message == 'shutdown') {
                this.shutdownServer()
            }
        })

        // Helmet on, for safety.
        app.use(helmet())

        // Webpack watcher for asset recompiling in development environment
        if (process.env.NODE_ENV !== 'production') {

            this.webpackDevMiddleware = webpackDevMiddleware(webpackCompiler, {
                publicPath: webpackConfig.output.publicPath,
                stats: 'minimal',
                writeToDisk: true
            })

            // We just use webpack-dev-middleware as a runtime compiler
            // Disable in-memory serving of assets as an Express middleware
            //app.use(this.webpackDevMiddleware)
        }

        // Our webpack assets
        app.use('/assets', express.static(path.resolve(__dirname, 'dist', 'assets')))


        // Routes from config/routes.js
        const routes = require('./config/routes.js')

        routes.forEach((route) => {
            const method = route.method
            const path = route.path
            const routeModule = route.controller.substr(0, route.controller.indexOf('#'))
            const routeHandler = route.controller.substring(route.controller.lastIndexOf('#') + 1)

            const routeHandlerObject = require(`./controllers/${routeModule}.js`)

            app[method.toLowerCase()](path, routeHandlerObject[routeHandler].bind(routeHandlerObject))

        })

        // Default endpoint for everything else
        app.use((req, res) => {
            const ip = req.connection.remoteAddress
            const method = req.method
            const url = req.originalUrl
            logger.log('notice', `Wildcard request ${method} ${url} (from: ${ip})`, 'no-rollbar')
            res.status(404).send('404 Not Found')
        })

        return true
    }

    async runServer() {
        const [status, error] = await handle(this.setupServer())

        if(error) {
            logger.safeError('emerg', 'ServerWorker.setupServer() failed', error)
            return await this.shutdownServer()
        }

        // Default to listening on all interfaces if not set in ENV
        const listenHost = process.env.SERVER_LISTEN_HOST || '0.0.0.0'

        const portInsecure = process.env.SERVER_LISTEN_PORT_INSECURE

        if(portInsecure && !isNaN(portInsecure)) {
            this.serverInsecure = http.createServer(app)
            this.serverInsecure.on('error', this._handleHttpServerError.bind(this))
            this.serverInsecure.on('clientError', this._handleHttpClientError.bind(this))
            this.serverInsecure.on('close', () => {
                logger.log('info', chalk.bgBlue('[Express] HTTP Server closed'))
            })
            this.serverInsecure.listen(portInsecure, listenHost, () => {
                // Create terminator only after Express is listening for connections
                this.httpTerminator = httpTerminator.createHttpTerminator({
                    server: this.serverInsecure,
                    gracefulTerminationTimeout: 5000
                })
                logger.log('info', chalk.bgBlue(`[Express] Server listening on ${listenHost}:${portInsecure} (HTTP)`))
            })
        }

        const portSSL    = process.env.SERVER_LISTEN_PORT_SSL
        const sslPrivKey = process.env.SERVER_SSL_PRIVKEY
        const sslCert    = process.env.SERVER_SSL_CERT
        const sslCA      = process.env.SERVER_SSL_CA

        if(portSSL && !isNaN(portSSL) && sslPrivKey && sslCert && sslCA) {
            const sslPrivKeyData = await util.readFile(sslPrivKey)
            if(sslPrivKeyData === false) {
                logger.log('alert', `Unable to read SSL cert from SERVER_SSL_PRIVKEY; cannot start HTTPS server.`)
            }
            const sslCertData = await util.readFile(sslCert)
            if(sslCertData === false) {
                logger.log('alert', `Unable to read SSL cert from SERVER_SSL_CERT; cannot start HTTPS server.`)
            }
            const sslCAdata = await util.readFile(sslCA)
            if(sslCAdata === false) {
                logger.log('alert', `Unable to read SSL cert from SERVER_SSL_CA; cannot start HTTPS server.`)
            }

            if(sslPrivKeyData !== false && sslCertData !== false && sslCAdata !== false) {
                let credentials = {
                    key: sslPrivKeyData,
                    cert: sslCertData,
                    ca: sslCAdata
                }
    
                if(process.env.SERVER_SSL_MINVERSION) {
                    credentials['minVersion'] = process.env.SERVER_SSL_MINVERSION
                }
    
                this.serverSSL = https.createServer(credentials, app)

                this.serverSSL.on('error', this._handleHttpServerError.bind(this))
                this.serverSSL.on('clientError', this._handleHttpClientError.bind(this))

                this.serverSSL.on('close', () => {
                    logger.log('info', chalk.bgBlue('[Express] HTTPS Server closed'))
                })

                this.serverSSL.listen(portSSL, listenHost, () => {
                    // Create terminator only after Express is listening for connections
                    this.httpsTerminator = httpTerminator.createHttpTerminator({
                        server: this.serverSSL,
                        gracefulTerminationTimeout: 5000
                    })
                    logger.log('info', chalk.bgBlue(`[Express] Server listening on ${listenHost}:${portInsecure} (HTTPS)`))
                })
            }
        }

        if(this.serverInsecure === null && this.serverSSL === null) {
            logger.log('emerg', 'Neither HTTP nor HTTPS server was able to start, exiting...')
            return await this.shutdownServer()
        }
    }


    async shutdownServer() {
        if(this.serverQuitting === false) {
            this.serverQuitting = true

            if (process.env.NODE_ENV !== 'production') {
                await this._closeWebpackDevMiddleware()
            }

            // Gracefully exit HTTP(S) connections
            if (this.httpTerminator !== null) {
                logger.log('debug', 'Gracefully closing HTTP connections...')
                await this.httpTerminator.terminate()
            }

            if (this.httpsTerminator !== null) {
                logger.log('debug', 'Gracefully closing HTTPS connections...')
                await this.httpsTerminator.terminate()
            }

            // Send process shutdown request to master process
            process.send({ 'type': 'shutdown' })
        }
    }


    _closeWebpackDevMiddleware() {{
        return new Promise((resolve) => {
            if(this.webpackDevMiddleware === null) {
                resolve()
            } else {
                this.webpackDevMiddleware.close(() => {
                    logger.log('debug', 'webpack-dev-middleware closed.')
                    resolve()
                })
            }
        })
    }}


    _handleHttpServerError(error) {
        if(error.code === 'EACCES') {
            logger.log('emerg', `Failed to start HTTP server: Access denied when binding to ${error.address} port ${error.port}`)
        } else if(error.code === 'EADDRINUSE') {
            logger.log('emerg', `Failed to start HTTP server: Address already in use: ${error.address}`)
        } else {
            logger.log('emerg', `Failed to start HTTP server: ${error.code} (${error.errno}), syscall: ${error.syscall}, stack trace:\n${error.stack}`)
        }

        this.shutdownServer()
    }


    _handleHttpClientError(err, socket) {
        try {
            /* In some cases, the client has already received the response and/or the socket has already
               been destroyed, like in case of ECONNRESET errors. Before trying to send data to the socket,
               it is better to check that it is still writable.
               https://nodejs.org/api/http.html#http_event_clienterror
            */
            if (err.code === 'ECONNRESET' || !socket.writable) {
                throw new Error('ECONNRESET or socket not writable')
            }

            const ip = socket.remoteAddress

            const errorBody = err.code
            const contentLength = errorBody.length

            let response = 'HTTP/1.1 400 Bad Request\r\n'
            response += 'Content-Type: text/plain\r\n'
            response += 'Content-Length: ' + contentLength + '\r\n'
            response += 'Connection: close\r\n'
            response += 'Date: ' + (new Date()).toUTCString() + '\r\n'
            response += '\r\n'
            response += errorBody

            logger.log('warning', `HTTP clientError: ${err.code}, remoteAddress: ${ip}`)

            socket.write(
                response,
                'UTF-8',
                () => socket.end()
            )
        }
    
        catch(fatalErr) {
            logger.log('error', `_handleHttpClientError(): ${fatalErr}`)
            socket.end()
        }
    }
}


module.exports = new ServerWorker
