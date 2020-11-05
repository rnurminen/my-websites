//
//
// Unnode.js server config
//
//


const path = require('path')

const helmet = require('helmet')

module.exports = [
    {
        'vhost': [ 'localhost' ],
        'viewEngine': 'pug',
        'viewsPath': path.resolve(__dirname, '..', 'dist', 'views'),
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
            { method: 'GET',  path: '/', controller: 'unnodejs.org/unnodejsorg_controller#index' },

            { path: '/assets',  static: path.resolve(__dirname, '..', 'dist', 'assets') }

        ]
    },
    {
        'vhost': [ 'nurminen.local', '*.nurminen.local' ],
        'secureContext': {
            'key': process.env.UNNODE_NURMINEN_LOCAL_KEY,
            'cert': process.env.UNNODE_NURMINEN_LOCAL_CERT
        },
        'routes': [
            { method: 'GET', path: '/', controller: 'nurminen.dev/nurminendev_controller#index' },
        ]
    }
]