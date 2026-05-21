import { sendToOpenObserve } from "telemetry/openobserve";
import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from 'express';

export function tracingMiddleware(req: Request, res: Response, next: NextFunction) {
  const traceId = req.headers["x-trace-id"] || uuidv4();
  req.traceId = traceId;

  res.on("finish", async () => {
    const level = res.statusCode >= 500 ? 'error'
      : res.statusCode >= 400 ? 'warn'
        : 'info';

    await sendToOpenObserve({
      level,
      traceId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      timestamp: new Date().toISOString(),
    });
  });

  next();
}
