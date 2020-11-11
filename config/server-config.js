//
//
// Unnode.js server config
//
//


const path = require('path')

const helmet = require('helmet')

module.exports = [
    {
        'vhost': [ 'localhost', 'unnodejs.org' ],
        'viewEngine': 'pug',
        'viewsPath': path.resolve(__dirname, '..', 'dist', 'views'),
        'serveFavicon': path.resolve(__dirname, '..', 'dist', 'assets', 'images', 'icons', 'favicon.ico'),
        'secureContext': {
            'key': process.env.UNNODE_SERVER_SECURE_DEFAULT_KEY,
            'cert': process.env.UNNODE_SERVER_SECURE_DEFAULT_CERT
        },
        'helmetOptions': {
            contentSecurityPolicy: {
                directives: {
                    'default-src': ["'self'"],
                    'img-src': ["'self'", 'img.shields.io'],
                    'style-src': ["'self'", 'fonts.googleapis.com'],
                    'font-src': ["'self'", 'fonts.gstatic.com']
                }
            }
        },
        'routes': [
            { method: 'GET',  path: '/', controller: 'unnodejs.org/unnodejs-controller#index' },
            { method: 'GET',  path: '/copyright', controller: 'unnodejs.org/unnodejs-controller#copyright_page' },

            { path: '/assets',  static: path.resolve(__dirname, '..', 'dist', 'assets') },
        ]
    },
    {
        'vhost': [ 'www.localhost', 'www.unnodejs.org' ],
        'secureContext': {
            'key': process.env.UNNODE_SERVER_SECURE_DEFAULT_KEY,
            'cert': process.env.UNNODE_SERVER_SECURE_DEFAULT_CERT
        },
        'routes': [
            { method: 'GET',  path: '*', controller: 'unnodejs.org/unnodejs-controller#redirectToNonWww' }
        ]

    },
    {
        'vhost': [ 'nurminen.local', '*.nurminen.local' ],
        'secureContext': {
            'key': process.env.UNNODE_NURMINEN_LOCAL_KEY,
            'cert': process.env.UNNODE_NURMINEN_LOCAL_CERT
        },
        'routes': [
            { method: 'GET', path: '/', controller: 'nurminen.dev/nurminendev-controller#index' },
        ]
    }
]