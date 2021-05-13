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


import path from 'node:path'
import dotenv   from 'dotenv'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

dotenv.config({ path: `${__dirname}/.env` })

import { readPackageUpAsync } from 'read-pkg-up'

import { isMaster, isWorker }   from 'unnode'
import { utils }                from 'unnode'


if(isMaster) {

    //////////////////////////////////////////////////////////////////////
    //
    // MASTER app process
    //
    //////////////////////////////////////////////////////////////////////

    const unnode = await import('unnode')

    const masterLogger = unnode.masterLogger

    // Pre-init logger, otherwise it won't be usable until after unnodeMaster.init()
    masterLogger.init(__dirname)

    const chalk = (await import('chalk')).default

    const unnodePkg   = await readPackageUpAsync({ cwd: './node_modules/unnode'})
    const expressPkg  = await readPackageUpAsync({ cwd: './node_modules/express' })
    const helmetPkg   = await readPackageUpAsync({ cwd: './node_modules/helmet' })
    const httptermPkg = await readPackageUpAsync({ cwd: './node_modules/http-terminator' })
    const fetchPkg    = await readPackageUpAsync({ cwd: './node_modules/node-fetch' })
    const winstonPkg  = await readPackageUpAsync({ cwd: './node_modules/winston' })

    masterLogger.log('info', '')
    masterLogger.log('info', '')
    masterLogger.log('info', '    ' + chalk.underline.bold('my-websites'))
    masterLogger.log('info', '')
    masterLogger.log('info', '    Copyright (c) 2020, 2021 Riku Nurminen')
    masterLogger.log('info', '')
    masterLogger.log('info', '    All rights reserved by me :)')
    masterLogger.log('info', '')
    masterLogger.log('info', '')
    masterLogger.log('info', chalk.whiteBright(`Unnode.js...........v${unnodePkg.packageJson.version}`))
    masterLogger.log('info', chalk.whiteBright(`Express.............v${expressPkg.packageJson.version}`))
    masterLogger.log('info', chalk.whiteBright(`Helmet..............v${helmetPkg.packageJson.version}`))
    masterLogger.log('info', chalk.whiteBright(`http-terminator.....v${httptermPkg.packageJson.version}`))
    masterLogger.log('info', chalk.whiteBright(`node-fetch..........v${fetchPkg.packageJson.version}`))
    masterLogger.log('info', chalk.whiteBright(`Winston.............v${winstonPkg.packageJson.version}`))
    masterLogger.log('info', '')

    unnode.master.init(__dirname)
        .catch(error => masterLogger.safeError('emerg', 'UnnodeMaster.init() failed', error))


} else if(isWorker) {


    //////////////////////////////////////////////////////////////////////
    //
    // WORKER app process
    //
    //////////////////////////////////////////////////////////////////////

    const sqreen = process.env.SQREEN_TOKEN ? require('sqreen') : null
    
    runWorker()

}


async function runWorker() {
    const unnode = await import('unnode')

    const unnodeWorker = unnode.worker
    const workerLogger = unnode.workerLogger

    try {
        const [status, error] = await utils.handle(unnodeWorker.setupServer(__dirname))

        if(error) {
            workerLogger.safeError('emerg', 'UnnodeWorker.setupServer() failed', error)
            return unnodeWorker.shutdownServer()
        }

        unnodeWorker.addWildcardRoute(false)

        unnodeWorker.runServer().catch((error) => {
            workerLogger.safeError('error', `Worker failed to start`, error)
            process.exit(0)
        })
    } catch(error) {
        workerLogger.safeError('error', `Worker failed to start`, error)
        process.exit(0)
    }

}
