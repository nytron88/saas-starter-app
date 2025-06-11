import { NextRequest, NextResponse } from "next/server";
import logger from "./logger";
import { errorResponse } from "./responseWrapper";
import { Prisma } from "../../generated/prisma";

type Handler = (request: NextRequest) => Promise<NextResponse>;

export function withLoggerAndErrorHandler(handler: Handler): Handler {
  return async function wrappedHandler(request: NextRequest) {
    const start = Date.now();

    try {
      const response = await handler(request);

      const duration = Date.now() - start;
      logger.info(
        JSON.stringify({
          method: request.method,
          url: request.nextUrl.pathname,
          status: response.status,
          responseTime: `${duration}ms`,
        })
      );

      return response;
    } catch (err: unknown) {
      const duration = Date.now() - start;

      // Narrow the error type
      const error = err instanceof Error ? err : new Error("Unknown error");

      logger.error(
        JSON.stringify({
          method: request.method,
          url: request.nextUrl.pathname,
          error: error.message,
          errorType: error.name,
          stack: error.stack,
          responseTime: `${duration}ms`,
        })
      );

      // Handle Prisma-specific errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return errorResponse("Database error", 400, {
          code: error.code,
          message: error.message,
        });
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        return errorResponse("Invalid data provided", 400, {
          message: error.message,
        });
      }

      if (error instanceof SyntaxError) {
        return errorResponse("Invalid JSON in request body", 400, {
          message: error.message,
        });
      }

      // Default: Internal server error
      return errorResponse("Internal Server Error", 500, {
        message: error.message,
        type: error.name,
      });
    }
  };
}
