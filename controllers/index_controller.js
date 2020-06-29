//
//
// nurminen-dev-platform - NodeJS/Express development and testing playground
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


const logger = require('@bit/nurminendev.utils.logger').workerLogger


class IndexController {
    constructor() {
        this.testVar = 0
    }

    index(req, res) {
        this.testVar++

        logger.log('debug', `Testvar is: ${this.testVar}`)

        res.end('test' + this.testVar)
    }


    test(req, res) {
        this.testVar++

        logger.log('debug', `Testvar is: ${this.testVar}`)

        res.end('test' + this.testVar)
    }

}


module.exports = new IndexController()