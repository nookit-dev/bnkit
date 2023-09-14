export type onErrorHandler = (
  error: Error,
  request: Request
) => Response | Promise<Response>;

export function handleRequestError(
  err: Error,
  errorMessage: string,
  onErrorHandler?: onErrorHandler,
  request?: Request
): Response | Promise<Response> {
  if (onErrorHandler) {
    return onErrorHandler(err, request!);
  }
  console.error("Error processing request:", err);
  return new Response(errorMessage || "Internal Server Error", { status: 500 });
}
