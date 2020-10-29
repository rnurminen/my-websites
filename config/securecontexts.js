//
// my-websites: Virtual hosts TLS certs
//


module.exports = [
    {
        'hostname': 'localhost',
        'credentials': {
            'key': process.env.UNNODE_SERVER_SECURE_DEFAULT_KEY,
            'cert': process.env.UNNODE_SERVER_SECURE_DEFAULT_CERT
        }
    },
    {
        'hostname': 'vhost.local',
        'credentials': {
            'key': process.env.UNNODE_VHOST_LOCAL_KEY,
            'cert': process.env.UNNODE_VHOST_LOCAL_CERT
        }
    }
]