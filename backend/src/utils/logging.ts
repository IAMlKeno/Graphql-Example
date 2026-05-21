import { GraphQLRequestContext } from "@apollo/server/dist/esm";
import { sendToOpenObserve } from "telemetry/openobserve";

interface R {
  traceId: string;
}
type MyRequestContext = {
  req: R;
}

export const loggingPlugin = {
  async requestDidStart(requestContext: GraphQLRequestContext<MyRequestContext>) {
    const traceId = requestContext.contextValue.req.traceId;

    return {
      async didResolveOperation(ctx) {
        await sendToOpenObserve({
          level: 'info',
          traceId,
          operationName: ctx.request.operationName,
          query: ctx.request.query,
          variables: ctx.request.variables,
          timestamp: new Date().toISOString(),
        });
      },

      async didEncounterErrors(ctx) {
        await sendToOpenObserve({
          level: 'error',
          traceId,
          errors: ctx.errors.map(e => e.message),
          timestamp: new Date().toISOString(),
        });
      },
    };
  },
};
