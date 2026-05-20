import { sendToOpenObserve } from "telemetry/openobserve";

export const loggingPlugin = {
  async requestDidStart(requestContext) {
    const traceId = requestContext.contextValue.req.traceId;

    return {
      async didResolveOperation(ctx) {
        await sendToOpenObserve({
          traceId,
          operationName: ctx.request.operationName,
          query: ctx.request.query,
          variables: ctx.request.variables,
          timestamp: new Date().toISOString(),
        });
      },

      async didEncounterErrors(ctx) {
        await sendToOpenObserve({
          traceId,
          errors: ctx.errors.map(e => e.message),
          timestamp: new Date().toISOString(),
        });
      },
    };
  },
};
