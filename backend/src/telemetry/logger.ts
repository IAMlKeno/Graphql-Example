import pino from "pino";
import { Writable } from 'node:stream';
import { sendToOpenObserve, type LogLevel } from './openobserve';

const LEVEL_MAP: Record<number, LogLevel> = {
  10: 'trace', 20: 'debug', 30: 'info', 40: 'warn', 50: 'error', 60: 'fatal',
};

const ooStream = new Writable({
  write(chunk: Buffer, _encoding, callback) {
    try {
      const log = JSON.parse(chunk.toString());
      sendToOpenObserve({
        ...log,
        level: LEVEL_MAP[log.level] ?? 'info',
        timestamp: new Date(log.time).toISOString(),
      }).finally(callback);
    } catch {
      callback();
    }
  },
});

const logLevel = process.env.LOG_LEVEL || 'info';

export const logger = pino(
  { level: logLevel },
  pino.multistream([
    ...(process.env.NODE_ENV !== 'production'
      ? [{ stream: pino.transport({ target: 'pino-pretty', options: { colorize: true } }), level: 'debug' as const }]
      : []
    ),
    { stream: ooStream, level: logLevel as pino.Level },
  ])
);
