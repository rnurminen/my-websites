//
//
// my-websites
//
// Copyright (c) 2020 Riku Nurminen
//
// All rights reserved by me. :)
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

    const clusterVersion  = require('cluster/package.json').version
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
    masterLogger.log('info', chalk.whiteBright(`Node Cluster API    v${clusterVersion}`))
    masterLogger.log('info', chalk.whiteBright(`Express             v${expressVersion}`))
    masterLogger.log('info', chalk.whiteBright(`Helmet              v${helmetVersion}`))
    masterLogger.log('info', chalk.whiteBright(`http-terminator     v${httptermVersion}`))
    masterLogger.log('info', chalk.whiteBright(`node-fetch          v${fetchVersion}`))
    masterLogger.log('info', chalk.whiteBright(`Winston             v${winstonVersion}`))
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
    
        // Default endpoint for everything else
        app.use((req, res) => {
            const ip = req.connection.remoteAddress
            const method = req.method
            const url = req.originalUrl
            const agent = req.get('user-agent')
            workerLogger.log('notice', `Wildcard request ${method} ${url} (from: ${ip}, User-Agent: ${agent})`, 'no-rollbar')
            res.status(404).send('404 Not Found')
        })
    
        unnodeWorker.runServer().catch((error) => {
            workerLogger.safeError('error', `Worker failed to start`, error)
            process.exit(0)
        })
    } catch(error) {
        workerLogger.safeError('error', `Worker failed to start`, error)
        process.exit(0)
    }

}
