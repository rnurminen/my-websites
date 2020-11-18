//
//
// Unnode.js server config
//
//


const path = require('path')

const noCache = { noCache: true }

module.exports = [
    {
        'vhost': [ 'localhost', 'unnodejs.org' ],
        'serveFavicon': path.resolve(__dirname, '..', 'dist', 'unnodejs', 'images', 'icons', 'favicon.ico'),
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
                    'font-src': ["'self'", 'fonts.gstatic.com'],
                    'script-src': ["'self'", "'unsafe-eval'"],
                    'object-src': ["'self'"],
                }
            }
        },
        'routes': [
            { method: 'GET',  path: '/', controller: 'unnodejs.org/unnodejs-controller#index', cacheControl: noCache },
            { method: 'GET',  path: '/doc/latest', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', cacheControl: noCache },
            { method: 'GET',  path: '/doc/latest/getting-started', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'getting-started', cacheControl: noCache },
            { method: 'GET',  path: '/doc/latest/configuration', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'configuration', cacheControl: noCache },
            { method: 'GET',  path: '/doc/latest/process-clustering', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'process-clustering', cacheControl: noCache },
            { method: 'GET',  path: '/doc/latest/vhosts', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'vhosts', cacheControl: noCache },
            { method: 'GET',  path: '/doc/latest/logging', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'logging', cacheControl: noCache },
            { method: 'GET',  path: '/doc/latest/utils', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'utils', cacheControl: noCache },
            { method: 'GET',  path: '/doc/latest/api-reference', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'api-reference', cacheControl: noCache },
            { method: 'GET',  path: '/team', controller: 'unnodejs.org/unnodejs-controller#teamPage', cacheControl: noCache },
            { method: 'GET',  path: '/legal/copyright', controller: 'unnodejs.org/unnodejs-controller#copyrightPage', cacheControl: noCache },
            { method: 'GET',  path: '/legal/privacy-policy', controller: 'unnodejs.org/unnodejs-controller#privacyPolicyPage', cacheControl: noCache },
            { method: 'GET',  path: '/legal/terms-of-service', controller: 'unnodejs.org/unnodejs-controller#termsOfServicePage', cacheControl: noCache },

            { path: '/css',  static: path.resolve(__dirname, '..', 'dist', 'css') },
            { path: '/js',  static: path.resolve(__dirname, '..', 'dist', 'js') },
            { path: '/images',  static: path.resolve(__dirname, '..', 'dist', 'unnodejs', 'images') },

            // API
            { method: 'GET',  path: '/api/pageattributes', controller: 'unnodejs.org/unnodejs-controller#api_pageAttributes', cacheControl: noCache },
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

            { path: '/css',  static: path.resolve(__dirname, '..', 'dist', 'css') },
            { path: '/js',  static: path.resolve(__dirname, '..', 'dist', 'js') },
            { path: '/images',  static: path.resolve(__dirname, '..', 'dist', 'nurminendev', 'images') },
        ]
    }
]