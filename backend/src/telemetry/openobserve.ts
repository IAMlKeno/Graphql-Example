import axios from "axios";

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface OOLog {
  level: LogLevel;
  timestamp: string;
  [key: string]: unknown;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  trace: 0, debug: 1, info: 2, warn: 3, error: 4, fatal: 5,
};
const MIN_LEVEL = (process.env.OO_MIN_LEVEL ?? 'info') as LogLevel;

export async function sendToOpenObserve(log: OOLog) {
  if (LEVEL_PRIORITY[log.level] < LEVEL_PRIORITY[MIN_LEVEL]) return;

  try {
    await axios.post(process.env.OO_ENDPOINT, log, {
      headers: {
        Authorization: process.env.OO_AUTH,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Failed to send log", err.message);
  }
}
