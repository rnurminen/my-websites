//
//
// Unnode.js server config
//
//


const path = require('path')

const noCache = { noCache: true }

module.exports = [
    {
        'vhost': [ 'unnodejs.local', 'unnodejs.org' ],
        'secureContext': {
            'key': process.env.UNNODE_SERVER_SECURE_DEFAULT_KEY,
            'cert': process.env.UNNODE_SERVER_SECURE_DEFAULT_CERT
        },
        'helmetOptions': {
            contentSecurityPolicy: {
                directives: {
                    'default-src': ["'self'", 'www.google-analytics.com'],
                    'img-src': ["'self'", 'img.shields.io'],
                    'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
                    'font-src': ["'self'", 'fonts.gstatic.com'],
                    'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'www.googletagmanager.com'],
                    'object-src': ["'self'"],
                }
            }
        },
        'robotsTxt': "User-agent: *\nAllow: /",
        'serveFavicon': path.resolve(__dirname, '..', 'dist', 'unnodejs', 'images', 'icons', 'favicon.ico'),
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
            { path: '/shared/images',  static: path.resolve(__dirname, '..', 'dist', 'shared', 'images') },

            // API
            { method: 'GET',  path: '/api/pageattributes', controller: 'unnodejs.org/unnodejs-controller#api_pageAttributes', cacheControl: noCache },
        ]
    },
    {
        'vhost': [ 'www.unnodejs.local', 'www.unnodejs.org' ],
        'secureContext': {
            'key': process.env.UNNODE_SERVER_SECURE_DEFAULT_KEY,
            'cert': process.env.UNNODE_SERVER_SECURE_DEFAULT_CERT
        },
        'routes': [
            { method: 'GET',  path: '*', controller: 'unnodejs.org/unnodejs-controller#redirectToNonWww' }
        ]

    },
    {
        'vhost': [ 'nurminendev.local', 'nurminen.dev' ],
        'secureContext': {
            'key': process.env.UNNODE_NURMINEN_LOCAL_KEY,
            'cert': process.env.UNNODE_NURMINEN_LOCAL_CERT
        },
        'helmetOptions': {
            contentSecurityPolicy: {
                directives: {
                    'default-src': ["'self'", 'www.google-analytics.com'],
                    'img-src': ["'self'"],
                    'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
                    'font-src': ["'self'", 'fonts.gstatic.com'],
                    'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'www.googletagmanager.com'],
                    'object-src': ["'self'"],
                }
            }
        },
        'robotsTxt': "User-agent: *\nAllow: /",
        'serveFavicon': path.resolve(__dirname, '..', 'dist', 'nurminendev', 'images', 'icons', 'favicon.ico'),
        'routes': [
            { method: 'GET', path: '/', controller: 'nurminen.dev/nurminendev-controller#index' },
            { method: 'GET', path: '/about', controller: 'nurminen.dev/nurminendev-controller#aboutPage' },
            { method: 'GET', path: '/contact', controller: 'nurminen.dev/nurminendev-controller#contactPage' },
            { method: 'GET',  path: '/legal/copyright', controller: 'nurminen.dev/nurminendev-controller#copyrightPage', cacheControl: noCache },
            { method: 'GET',  path: '/legal/privacy-policy', controller: 'nurminen.dev/nurminendev-controller#privacyPolicyPage', cacheControl: noCache },
            { method: 'GET',  path: '/legal/terms-of-service', controller: 'nurminen.dev/nurminendev-controller#termsOfServicePage', cacheControl: noCache },

            { path: '/css',  static: path.resolve(__dirname, '..', 'dist', 'css') },
            { path: '/js',  static: path.resolve(__dirname, '..', 'dist', 'js') },
            { path: '/images',  static: path.resolve(__dirname, '..', 'dist', 'nurminendev', 'images') },
            { path: '/shared/images',  static: path.resolve(__dirname, '..', 'dist', 'shared', 'images') },
            { path: '/pdf',  static: path.resolve(__dirname, '..', 'dist', 'nurminendev', 'pdf') },


            // API
            { method: 'GET',  path: '/api/pageattributes', controller: 'nurminen.dev/nurminendev-controller#api_pageAttributes', cacheControl: noCache },
        ]
    },
    {
        'vhost': [ 'www.nurminendev.local', 'www.nurminen.dev' ],
        'routes': [
            { method: 'GET',  path: '*', controller: 'nurminen.dev/nurminendev-controller#redirectToNonWww' }
        ]
    }
]
