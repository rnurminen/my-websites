//
//
// Unnode.js server config
//
//


const path = require('path')

const htmlCacheControl = { noCache: true }

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
                    'font-src': ["'self'", 'fonts.gstatic.com']
                }
            }
        },
        'routes': [
            { method: 'GET',  path: '/', controller: 'unnodejs.org/unnodejs-controller#index', cacheControl: htmlCacheControl },
            { method: 'GET',  path: '/doc/latest', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', cacheControl: htmlCacheControl },
            { method: 'GET',  path: '/doc/latest/getting-started', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'getting-started', cacheControl: htmlCacheControl },
            { method: 'GET',  path: '/doc/latest/configuration', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'configuration', cacheControl: htmlCacheControl },
            { method: 'GET',  path: '/doc/latest/process-clustering', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'process-clustering', cacheControl: htmlCacheControl },
            { method: 'GET',  path: '/doc/latest/vhosts', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'vhosts', cacheControl: htmlCacheControl },
            { method: 'GET',  path: '/doc/latest/logging', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'logging', cacheControl: htmlCacheControl },
            { method: 'GET',  path: '/doc/latest/utils', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'utils', cacheControl: htmlCacheControl },
            { method: 'GET',  path: '/doc/latest/api-reference', controller: 'unnodejs.org/unnodejs-controller#docLatestPage', customParameter: 'api-reference', cacheControl: htmlCacheControl },
            { method: 'GET',  path: '/team', controller: 'unnodejs.org/unnodejs-controller#teamPage', cacheControl: htmlCacheControl },
            { method: 'GET',  path: '/legal/copyright', controller: 'unnodejs.org/unnodejs-controller#copyrightPage', cacheControl: htmlCacheControl },
            { method: 'GET',  path: '/legal/privacy-policy', controller: 'unnodejs.org/unnodejs-controller#privacyPolicyPage', cacheControl: htmlCacheControl },
            { method: 'GET',  path: '/legal/terms-of-service', controller: 'unnodejs.org/unnodejs-controller#termsOfServicePage', cacheControl: htmlCacheControl },

            { path: '/css',  static: path.resolve(__dirname, '..', 'dist', 'css') },
            { path: '/js',  static: path.resolve(__dirname, '..', 'dist', 'js') },
            { path: '/images',  static: path.resolve(__dirname, '..', 'dist', 'unnodejs', 'images') },
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