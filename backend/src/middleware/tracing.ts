import { sendToOpenObserve } from "telemetry/openobserve";
import { v4 as uuidv4 } from "uuid";

export function tracingMiddleware(req, res, next) {
  const traceId = req.headers["x-trace-id"] || uuidv4();
  req.traceId = traceId;

  res.on("finish", async () => {
    await sendToOpenObserve({
      traceId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      timestamp: new Date().toISOString(),
    });
  });

  next();
}
