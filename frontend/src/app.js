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


//
// webpack entry file
//


//
// Load assets
//
import '../css/styles.scss'
import 'highlight.js/styles/monokai-sublime.css';

import * as zenscroll from 'zenscroll/zenscroll-min'

import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'

require.context('../images/static', true, /\.(png|jpe?g|svg)$/)
require.context('../images/icons', true, /\.(png|jpe?g|ico|svg)$/)


//
// App wide JS
//

const zenscrollDefaultDuration = 400 // ms
const zenscrollEdgeOffset = 25 // px
zenscroll.setup(zenscrollDefaultDuration, zenscrollEdgeOffset)


hljs.registerLanguage('javascript', javascript)

document.addEventListener('DOMContentLoaded', () => {
    const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    if(navbarBurgers.length > 0) {
        navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {
                const target = el.dataset.target
                const $target = document.getElementById(target)
                el.classList.toggle('is-active')
                $target.classList.toggle('is-active')
            })
        })
    }

    const frontpageSection = document.querySelector('#frontpage')

    if(frontpageSection) {
        window.onscroll = function () {
            // Change navbar background to white when page is scrolled
            const nav = document.getElementById('navbar')

            if (window.pageYOffset > 0) {
                nav.classList.add('is-white')
                nav.classList.remove('is-dark')
            } else {
                nav.classList.add('is-dark')
                nav.classList.remove('is-white')
            }
        }
    }

    hljs.initHighlightingOnLoad()

})


