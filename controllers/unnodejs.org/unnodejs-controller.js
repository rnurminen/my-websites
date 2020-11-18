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


const path      = require('path')
const logger    = require('unnode').workerLogger
const unUtils   = require('unnode').utils


class UnnodejsOrgController {
    _viewsDir = path.resolve(__dirname, '..', '..', 'dist', 'unnodejs', 'views')
    _copyrightStartYear = 2020


    constructor() {

    }


    index(_, req, res) {
        res.sendFile(path.join(this._viewsDir, 'index.html'))
    }

    docLatestPage(page, req, res) {
        if(page) {
            res.render(`doc/latest/${page}`, Object.assign({ }, this._getDefaultPageAttribs()))
        } else {
            res.render('doc/index', Object.assign({ }, this._getDefaultPageAttribs()))
        }
    }

    teamPage(_, req, res) {
        res.render('team', Object.assign({ }, this._getDefaultPageAttribs()))
    }

    copyrightPage(_, req, res) {
        res.render('copyright', Object.assign({ }, this._getDefaultPageAttribs()))
    }

    privacyPolicyPage(_, req, res) {
        res.render('privacy-policy', Object.assign({ }, this._getDefaultPageAttribs()))
    }

    termsOfServicePage(_, req, res) {
        res.render('terms-of-service', Object.assign({ }, this._getDefaultPageAttribs()))
    }

    redirectToNonWww(_, req, res) {
        const protocol  = req.headers["x-forwarded-proto"] || req.protocol
        const newHost   = req.get('host').slice(4)
        return res.redirect(301, protocol + '://' + newHost + req.originalUrl)
    }


    _getDefaultPageAttribs() {
        const copyrightYearsStr = unUtils.getCopyrightYears(this._copyrightStartYear)

        return {
            'copyrightYearsStr': copyrightYearsStr
        }
    }
}


module.exports = new UnnodejsOrgController()
