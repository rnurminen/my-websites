//
//
// my-websites
//
// Copyright (c) 2020 Riku Nurminen
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

require('dotenv').config({ path: `${__dirname}/.env` })

const path          = require('path')

const unnode        = require('../unnode/unnode.js')
const utils         = require('../unnode/unnode.js').utils
const handle        = utils.handle


if(unnode.isMaster) {

    //////////////////////////////////////////////////////////////////////
    //
    // MASTER app process
    //
    //////////////////////////////////////////////////////////////////////

    const unnodeMaster = require('../unnode/unnode.js').master
    const masterLogger = require('../unnode/unnode.js').masterLogger

    // Pre-init logger, otherwise it won't be usable until after unnodeMaster.init()
    masterLogger.init(__dirname)

    const chalk = require('chalk')

    const unnodeVersion   = require('unnode/package.json').version
    const expressVersion  = require('express/package.json').version
    const helmetVersion   = require('helmet/package.json').version
    const httptermVersion = require('http-terminator/package.json').version
    const fetchVersion    = require('node-fetch/package.json').version
    const winstonVersion  = require('winston/package.json').version

    masterLogger.log('info', '')
    masterLogger.log('info', '')
    masterLogger.log('info', '    ' + chalk.underline.bold('my-websites - The Websites'))
    masterLogger.log('info', '')
    masterLogger.log('info', '    Copyright (c) 2020 Riku Nurminen')
    masterLogger.log('info', '')
    masterLogger.log('info', '    All rights reserved by me :)')
    masterLogger.log('info', '')
    masterLogger.log('info', '')
    masterLogger.log('info', chalk.whiteBright(`Unnode.js...........v${unnodeVersion}`))
    masterLogger.log('info', chalk.whiteBright(`Express.............v${expressVersion}`))
    masterLogger.log('info', chalk.whiteBright(`Helmet..............v${helmetVersion}`))
    masterLogger.log('info', chalk.whiteBright(`http-terminator.....v${httptermVersion}`))
    masterLogger.log('info', chalk.whiteBright(`node-fetch..........v${fetchVersion}`))
    masterLogger.log('info', chalk.whiteBright(`Winston.............v${winstonVersion}`))
    masterLogger.log('info', '')

    unnodeMaster.init(__dirname)
        .catch(error => masterLogger.safeError('emerg', 'UnnodeMaster.init() failed', error))


} else if(unnode.isWorker) {


    //////////////////////////////////////////////////////////////////////
    //
    // WORKER app process
    //
    //////////////////////////////////////////////////////////////////////

    const sqreen = process.env.SQREEN_TOKEN ? require('sqreen') : null
    
    runWorker()

}


async function runWorker() {
    const express       = require('express')

    const unnodeWorker  = require('../unnode/unnode.js').worker
    const workerLogger  = require('../unnode/unnode.js').workerLogger

    try {
        const [status, error] = await handle(unnodeWorker.setupServer(__dirname))

        if(error) {
            workerLogger.safeError('emerg', 'UnnodeWorker.setupServer() failed', error)
            return unnodeWorker.shutdownServer()
        }

        const app = unnodeWorker.getServerApp()

        app.set('view engine', 'pug')

        if(process.env.NODE_ENV !== 'production') {
            app.locals.pretty = true
        }

        app.set('views', path.join(__dirname, 'dist', 'views'))

        // Our webpack assets
        app.use('/assets', express.static(path.resolve(__dirname, 'dist', 'assets')))

        unnodeWorker.addWildcardRoute()
    
        unnodeWorker.runServer().catch((error) => {
            workerLogger.safeError('error', `Worker failed to start`, error)
            process.exit(0)
        })
    } catch(error) {
        workerLogger.safeError('error', `Worker failed to start`, error)
        process.exit(0)
    }

}
