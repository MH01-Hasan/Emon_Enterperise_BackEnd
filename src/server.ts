import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { errorlogger, logger } from './shared/Logger';
import { Server } from 'http';

process.on('uncaughtException', error => {
  errorlogger.error(error);
  process.exit(1);
});
let server: Server;
async function main() {
  try {
    await mongoose.connect(config.Database_url as string);

    server = app.listen(config.port, () => {
      logger.info(`database conection Done and Listen port ${config.port}`);
    });
  } catch (err) {
    errorlogger.error('databse conection problem', err);
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorlogger.error(error);
        process.exit(1);
      });
    }
    process.exit(1);
  });
}
main();

process.on('SIGTERM', () => {
  logger.info('SIGTERM is Recieved');
  if (server) {
    server.close();
  }
});
