import type { MiddlewareFunction } from "react-router";

export const timingMiddleware: MiddlewareFunction = async (_, next) => {
  // Timing disabled for performance - uncomment to debug navigation
  // const start = performance.now();
  await next();
  // const duration = performance.now() - start;
  // console.log(`Navigation took ${duration}ms`);
}
