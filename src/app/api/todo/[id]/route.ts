import { withLoggerAndErrorHandler } from "@/lib/withLoggerAndErrorHandler";
import { errorResponse, successResponse } from "@/lib/responseWrapper";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import type { ContextWithId } from "@/lib/withLoggerAndErrorHandler";
import { TodoResponseData } from "@/types/todo";

export const DELETE = withLoggerAndErrorHandler(
  async (_: NextRequest, { params }: ContextWithId) => {
    const { userId } = await auth();

    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const { id: todoId } = params;

    const todo = await prisma.todo.findUnique({
      where: {
        id: todoId,
      },
    });

    if (todo?.userId !== userId) {
      return errorResponse("Unauthorized", 401);
    }

    await prisma.todo.delete({
      where: {
        id: todoId,
      },
    });

    return successResponse("Todo deleted successfully", null, 204);
  }
);

export const PATCH = withLoggerAndErrorHandler(
  async (request: NextRequest, { params }: ContextWithId) => {
    const { userId } = await auth();

    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const { isCompleted } = await request.json();

    if (typeof isCompleted !== "boolean") {
      return errorResponse("Invalid request body", 400);
    }

    const { id: todoId } = params;

    const todo = await prisma.todo.findUnique({
      where: {
        id: todoId,
      },
    });

    if (todo?.userId !== userId) {
      return errorResponse("Unauthorized", 401);
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: { isCompleted },
    });

    return successResponse<TodoResponseData>(
      "Todo updated successfully",
      { todo: updatedTodo },
      200
    );
  }
);
