//
// nurminen-dev-platform: Routes configuration
//

module.exports = [
    { 'method': 'GET', path: '/', 'controller': 'index_controller#index' },
    { 'method': 'GET', path: '/test', 'controller': 'index_controller#test' },
]