import { Logger } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';

const logger = new Logger('DatabaseBootstrap');

let inMemoryServerPromise: Promise<MongoMemoryServer> | null = null;

type ResolveDatabaseUriOptions = {
  configuredUri?: string;
  useInMemory?: boolean;
};

export async function resolveDatabaseUri({ configuredUri, useInMemory }: ResolveDatabaseUriOptions) {
  const normalizedUri = configuredUri?.trim();

  if (normalizedUri && !useInMemory) {
    return normalizedUri;
  }

  if (!inMemoryServerPromise) {
    logger.warn('No external MongoDB detected. Starting an in-memory MongoDB instance for local development.');
    inMemoryServerPromise = MongoMemoryServer.create({
      instance: {
        dbName: 'eeeco'
      }
    });
  }

  const server = await inMemoryServerPromise;
  return server.getUri();
}