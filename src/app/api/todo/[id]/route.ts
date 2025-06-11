import { withLoggerAndErrorHandler } from "@/lib/withLoggerAndErrorHandler";
import { errorResponse, successResponse } from "@/lib/responseWrapper";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import type { ContextWithId } from "@/lib/withLoggerAndErrorHandler";

export const DELETE = withLoggerAndErrorHandler(
  async (request: NextRequest, { params }: ContextWithId) => {
    const { userId } = await auth();

    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = params;

    return successResponse("Todo deleted successfully", null);
  }
);
