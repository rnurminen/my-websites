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

const { Parser } = require('webpack')


const logger                = require('unnode').workerLogger
const unUtils               = require('unnode').utils
const { _v }                = require('unnode').utils

const uaParser              = require('ua-parser-js')


class BaseController {
    constructor() {

    }


    logRequest(req) {
        // customParameter == "someParameter"
 
        const ip     = unUtils.getClientIp(req)
        const method = req.method
        const url    = unUtils.getRequestFullUrl(req)

        const ua     = uaParser(req.get('user-agent'))

        if(_v(['device', 'type'], ua) && _v(['device', 'vendor'], ua)) {
            logger.log('info', `${method} ${url} from ${ip} `
                + `(${ua.device.type} ${ua.device.vendor}, `
                + `${ua.browser.name} ${ua.browser.version}, `
                + `${ua.os.name} ${ua.os.version})`)
        } else {
            logger.log('info', `${method} ${url} from ${ip} `
                + `(${ua.browser.name} ${ua.browser.version}, `
                + `${ua.os.name} ${ua.os.version})`)
        }
    }

}


module.exports = BaseController
