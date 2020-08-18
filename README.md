# nurminen-dev-platform

**A highly customizable NodeJS / Express framework**

### Features

- Multi-core support for scalability, with Node Cluster API
  - Master process (`runner.js`):
    - Signal handling
      - SIGTERM and SIGINT: Gracefully shuts down connections to all workers before shutting them down
      - SIGUSR2: Graceful shutdown and restart workers (**code hot reload**)
    - Logging with [@bit/nurminendev.utils.logger](https://bit.dev/nurminendev/utils/logger).masterLogger
      - Based on [Winston](https://www.npmjs.com/package/winston)
      - Easy console, file and Rollbar logging
  - Worker process(es) (`server-worker.js`)
    - One per CPU, controllable with `WORKERS` env var
    - Logging with [@bit/nurminendev.utils.logger](https://bit.dev/nurminendev/utils/logger).workerLogger
      - Sends log messages via IPC channel to master process logger
- Ruby on Rails style route handling (`config/routes.js`)
  - {
        method: 'POST',
        path: '/v1/activities/products/:targetSystem',
        controller: V1_requestHandler,
        customParameter: 'activityProductList'
    }
