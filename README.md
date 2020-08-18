# nurminen-dev-platform

**A highly customizable NodeJS / Express framework**

### Features

- Master process (`runner.js`):
  - Multi-core support for scalability, with Node Cluster API
  - Signal handling
    - SIGTERM and SIGINT: Gracefully shuts down connections to all workers before shutting them down
    - SIGUSR2: Graceful shutdown and restart workers (**code hot reload**)
  - Logging with [@bit/nurminendev.utils.logger](https://bit.dev/nurminendev/utils/logger).masterLogger
    - Centralized logging from all workers
    - Colored console output
    - File logging with [Winston](https://www.npmjs.com/package/winston)
    - Rollbar logging
- Worker process(es) (`server-worker.js`)
  - One per CPU, controllable with `WORKERS` env var
  - Logging with [@bit/nurminendev.utils.logger](https://bit.dev/nurminendev/utils/logger).workerLogger
    - Sends log messages via IPC channel to master process logger

