//
//
// Unnode.js server config
//
//


const path = require('path')


module.exports = [
    {
        'vhost': [ 'localhost' ],
        'viewEngine': 'pug',
        'viewsPath': path.resolve(__dirname, '..', 'dist', 'views'),
        'secureContext': {
            'key': process.env.UNNODE_SERVER_SECURE_DEFAULT_KEY,
            'cert': process.env.UNNODE_SERVER_SECURE_DEFAULT_CERT
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