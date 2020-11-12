//
//
// Unnode.js server config
//
//


const path = require('path')

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
            { method: 'GET',  path: '/doc/latest', controller: 'unnodejs.org/unnodejs-controller#docLatestPage' },
            { method: 'GET',  path: '/doc/latest/getting-started', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'getting-started' },
            { method: 'GET',  path: '/doc/latest/configuration', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'configuration' },
            { method: 'GET',  path: '/doc/latest/process-clustering', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'process-clustering' },
            { method: 'GET',  path: '/doc/latest/vhosts', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'vhosts' },
            { method: 'GET',  path: '/doc/latest/logging', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'logging' },
            { method: 'GET',  path: '/doc/latest/utils', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'utils' },
            { method: 'GET',  path: '/doc/latest/api-reference', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'api-reference' },
            { method: 'GET',  path: '/team', controller: 'unnodejs.org/unnodejs-controller#teamPage' },
            { method: 'GET',  path: '/legal/copyright', controller: 'unnodejs.org/unnodejs-controller#copyrightPage' },
            { method: 'GET',  path: '/legal/privacy-policy', controller: 'unnodejs.org/unnodejs-controller#privacyPolicyPage' },
            { method: 'GET',  path: '/legal/terms-of-service', controller: 'unnodejs.org/unnodejs-controller#termsOfServicePage' },

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