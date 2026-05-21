import { ApolloLink, Observable } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { v4 as uuidv4 } from "uuid";

export const traceLink: ApolloLink | undefined = new ApolloLink((operation, forward) => {
  const traceId = uuidv4();

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      "x-trace-id": traceId,
    },
  }));

  return new Observable((observer) => {
    const subscription = forward(operation).subscribe({
      next: (response) => {
        fetch(import.meta.env.VITE_OO_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: import.meta.env.VITE_OO_AUTH,
          },
          body: JSON.stringify({
            traceId,
            operationName: operation.operationName,
            timestamp: new Date().toISOString(),
          }),
        });

        observer.next(response);

        return response;
      },
      error: (err) => observer.error(err),
      complete: () => observer.complete()
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    }
  });
});

export const errorLink = new ErrorLink(({ error, operation }) => {
  fetch(import.meta.env.VITE_OO_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      errors: error || operation,
      timestamp: new Date().toISOString(),
    }),
  });
});
