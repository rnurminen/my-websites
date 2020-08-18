# nurminen-dev-platform

![nurminen-dev-platform](https://i.imgur.com/c2MhEre.png)

**A highly customizable NodeJS / Express framework**

I use this framework as a base for my projects.

It can be used as backend-only (REST server, for example), or as standalone web-server serving a front-end.

## Features

**As a backend / web-server:**
- Multi-core support for scalability, with Node Cluster API
  - Master process (**runner.js**):
    - Signal handling
      - SIGTERM and SIGINT: Gracefully shuts down connections to all workers before shutting them down
      - SIGUSR2: Graceful shutdown and restart workers (**code hot reload**)
    - Logging with [@bit/nurminendev.utils.logger](https://bit.dev/nurminendev/utils/logger).masterLogger
      - Based on [Winston](https://www.npmjs.com/package/winston)
      - Centralized console, file and Rollbar logging
      - Automatically rotated logfiles for 30 days
  - Worker process(es) (**server-worker.js**)
    - One per CPU, controllable with `WORKERS` env var
    - Logging with [@bit/nurminendev.utils.logger](https://bit.dev/nurminendev/utils/logger).workerLogger
      - Sends log messages via IPC channel to master process logger
- Ruby on Rails style route handling (**config/routes.js**)
  - `{ method: 'POST', path: '/api', controller: 'api/handler#requestHandler', customParameter: 'someParam' }`
  - Will go to `controllers/api/handler.js` -> `class ApiController { requestHandler(customParameter, req, res) }`
  - `controllers/api/handler.js` should `module.exports = new ApiController` at the end!

**Front-end:**
- Basic webpack / VueJS template for building a front-end

## Env vars

```
# Maximum number of CPUs the server should use
# Omit or set to 0 to use all CPU cores
APP_WORKERS=4

# Logfile name, will be used as:
# server-dir/log/{APP_LOGFILE}-YYYY-MM-DD.log
# server-dir/log/{APP_LOGFILE}.log will be a symlink to current/latest logfile
# Logs are automatically rotated and kept for 30 days
APP_LOGFILE=app

# Server listen IP
SERVER_LISTEN_HOST=127.0.0.1

# Server listen port (HTTP, insecure)
# Omit or set to 0 to skip starting non-SSL server
SERVER_LISTEN_PORT_INSECURE=3000

# Server listen port, SSL
SERVER_LISTEN_PORT_SSL=443

# SSL certificates
SERVER_SSL_PRIVKEY=/path/to/privkey.pem
SERVER_SSL_CERT=/path/to/cert.pem
SERVER_SSL_CA=/path/to/chain.pem

# SSL minimum version allowed to connect to HTTPS server
# See: https://nodejs.org/api/tls.html#tls_tls_default_min_version
SERVER_SSL_MINVERSION=TLSv1.3

# Rollbar access token, leave empty to disable Rollbar logging
ROLLBAR_ACCESS_TOKEN=token

# Rollbar environment
ROLLBAR_ENVIRONMENT=development
```

## License
 
The MIT License (MIT)

Copyright (c) 2020 Riku Nurminen

[https://www.nurminen.dev](https://www.nurminen.dev)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.