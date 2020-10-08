//
//
// my-websites
//
// Copyright (c) 2020 Riku Nurminen
//
// All rights reserved by me. :)
//
//


const path   = require('path')
const logger = require('../../unnode/unnode.js').workerLogger

const moment = require('moment')


class IndexController {
    constructor() {
        this.testVar = 0
    }

    index(req, res) {
        res.render('index', { timeNow: moment().toISOString() })
    }


    test(req, res) {
        this.testVar++

        logger.log('debug', `Testvar is: ${this.testVar}`)

        res.end('test' + this.testVar)
    }

}


module.exports = new IndexController()