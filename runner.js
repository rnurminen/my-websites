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

const cluster = require('cluster')


if(cluster.isMaster) {

    const masterLogger = require('@bit/nurminendev.utils.logger').masterLogger
    const util = require('@bit/nurminendev.utils.miscutils')

    //////////////////////////////////////////////////////////////////////
    //
    // MASTER app process
    //
    //////////////////////////////////////////////////////////////////////

    process.title = 'master'

    masterLogger.init(__dirname)

    const chalk = require('chalk')

    const clusterVersion = require('cluster/package.json').version
    const expressVersion = require('express/package.json').version

    masterLogger.log('info', '')
    masterLogger.log('info', '')
    masterLogger.log('info', '    ' + chalk.underline.bold('nurminen-dev-platform'))
    masterLogger.log('info', '')
    masterLogger.log('info', '    Copyright 2020 Riku Nurminen - https://www.nurminen.dev')
    masterLogger.log('info', '')
    masterLogger.log('info', '')
    masterLogger.log('info', chalk.whiteBright(`Node Cluster API  v${clusterVersion}`))
    masterLogger.log('info', chalk.whiteBright(`Express           v${expressVersion}`))
    masterLogger.log('info', '')

    const cpuCount = require('os').cpus().length
    let workers = process.env.APP_WORKERS

    // APP_WORKERS must be >=1 and <= CPU count, else default to CPU count
    if(isNaN(workers) || workers < 1 || workers > cpuCount) {
        workers = cpuCount
    }

    masterLogger.log('info', `Detected ${cpuCount} CPUs, using ${workers}`)
    masterLogger.log('info', '')


    // Fire up workers
    for (let i = 0; i < workers; i++) {
        cluster.fork()
    }

    cluster.on('online', (worker) => {
        masterLogger.log('info', 'Worker process ' + chalk.bgRed(`[${worker.process.pid}]`) + ' online')
    })


    // Setup message handlers
    cluster.on('message', (worker, message) => {
        if(!util.isObject(message)) {
            return
        }

        switch(message.type) {
            case 'log':
                masterLogger.log(message.level, message.message, message.overrideRollbar)
                break
            case 'shutdown':
                worker.disconnect()
                break
            default:
                break

        }
    })

    cluster.on('disconnect', (worker) => {
        masterLogger.log('debug', chalk.bgRed(`[${worker.process.pid}]`) + ' IPC channel disconnected.')
    })

    cluster.on('exit', (worker, code, signal) => {
        if(code === 0) {
            // Normal worker process exit
            masterLogger.log('info', 'Worker process ' + chalk.bgRed(`[${worker.process.pid}]`) + ' exited normally.')
        } else if(signal === 'SIGKILL') {
            // SIGKILL = terminate
            masterLogger.log('info', 'Worker process ' + chalk.bgRed(`[${worker.process.pid}]`) + ' terminated with SIGKILL.')
        } else {
            // Abnormal exit, restart worker
            masterLogger.log('alert', 'Worker process ' + chalk.bgRed(`[${worker.process.pid}]`) + ` died abnormally (code: ${code}, signal: ${signal}), forking new...`)
            cluster.fork()
        }
    })


    // Signal handlers
    process.on('SIGINT', () => {
        masterLogger.log('info', 'Received SIGINT, shutting down workers')
        for (const id in cluster.workers) {
            // Send a shutdown request to worker, worker will then gracefully close down
            // and request a disconnect
            cluster.workers[id].send('shutdown')
        }
    })

    process.on('SIGTERM', () => {
        masterLogger.log('info', 'Received SIGTERM, shutting down workers')
        for (const id in cluster.workers) {
            // Send a shutdown request to worker, worker will then gracefully close down
            // and request a disconnect
            cluster.workers[id].send('shutdown')
        }
    })

    // HOT RELOAD
    process.on('SIGUSR2', () => {
        masterLogger.log('info', 'Received SIGUSR2, restarting workers')

        let wid
        const workerIds = []

        for(wid in cluster.workers) {
            workerIds.push(wid);
        }
    
        workerIds.forEach((wid) => {
            cluster.workers[wid].send('shutdown')
    
            setTimeout(() => {
                if(cluster.workers[wid]) {
                    cluster.workers[wid].kill('SIGKILL')
                }
            }, 6000) // http-terminator grace perioid is 5 seconds, set this to 6

            cluster.fork()
        })
    })


} else if(cluster.isWorker) {


    //////////////////////////////////////////////////////////////////////
    //
    // WORKER app process
    //
    //////////////////////////////////////////////////////////////////////

    // Master process will do signal handling
    process.on('SIGTERM', () => { })
    process.on('SIGINT', () => { })
    process.on('SIGUSR2', () => { })

    const serverWorker = require('./server-worker.js')

    serverWorker.runServer()

}
