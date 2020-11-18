//
//
// my-websites
//
// Copyright (c) 2020 Riku Nurminen
//
// All rights reserved by me. :)
//
//


const { merge }     = require('webpack-merge')

const common        = require('./webpack.common.js')


module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    //stats: 'verbose'
})
