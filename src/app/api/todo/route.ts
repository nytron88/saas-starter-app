import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { withLoggerAndErrorHandler } from "@/lib/withLoggerAndErrorHandler";
import { errorResponse, successResponse } from "@/lib/responseWrapper";
import { TodoResponseData, UserTodosResponseData } from "@/types/todo";
import { Prisma } from "../../../../generated/prisma";

const ITEMS_PER_PAGE = 10;
const NOT_SUBSCRIBED_TODOS_LIMIT = 5;

export const GET = withLoggerAndErrorHandler(async (request: NextRequest) => {
  const { userId } = await auth();

  if (!userId) {
    return errorResponse("Unauthorized", 401);
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");

  const search = searchParams.get("search") || "";

  const whereClause = {
    id: userId,
    title: {
      contains: search,
      mode: Prisma.QueryMode.insensitive,
    },
  };

  const todos = await prisma.todo.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    take: ITEMS_PER_PAGE,
    skip: (page - 1) * ITEMS_PER_PAGE,
  });

  const totalItems = await prisma.todo.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return successResponse<UserTodosResponseData>("Todos fetched successfully", {
    todos,
    totalItems,
    currentPage: page,
    totalPages,
  });
});

export const POST = withLoggerAndErrorHandler(async (request: NextRequest) => {
  const { userId } = await auth();

  if (!userId) {
    return errorResponse("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { todos: true },
  });

  if (!user) {
    return errorResponse("User not found", 404);
  }

  if (!user.isSubscribed && user.todos.length >= NOT_SUBSCRIBED_TODOS_LIMIT) {
    return errorResponse(
      `Free users can only create up to ${NOT_SUBSCRIBED_TODOS_LIMIT} todos. Please subscribe to create more.`,
      403
    );
  }

  const { title, description } = await request.json();

  if (!title) {
    return errorResponse("Title is required", 400);
  }

  if (typeof title === "string" && title.length > 100) {
    return errorResponse("Title must be less than 100 characters", 400);
  }

  if (
    description &&
    typeof description === "string" &&
    description.length > 500
  ) {
    return errorResponse("Description must be less than 500 characters", 400);
  }

  const todo = await prisma.todo.create({
    data: {
      title,
      description,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return successResponse<TodoResponseData>("Todo created successfully", {
    todo,
  });
});
