import { withLoggerAndErrorHandler } from "@/lib/withLoggerAndErrorHandler";
import { errorResponse, successResponse } from "@/lib/responseWrapper";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import type { SubsriptionResponseData } from "@/types/subscription";

export const POST = withLoggerAndErrorHandler(async () => {
  const { userId } = await auth();

  if (!userId) {
    return errorResponse("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return errorResponse("User not found", 404);
  }

  const susbscriptionEndsAt = new Date();
  susbscriptionEndsAt.setDate(susbscriptionEndsAt.getMonth() + 1);

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isSubscribed: true,
      susbscriptionEndsAt,
    },
  });

  return successResponse<SubsriptionResponseData>(
    "Successfully purchased subscription",
    {
      isSubscribed: updatedUser.isSubscribed,
      subscriptionEndsAt: updatedUser.susbscriptionEndsAt!,
    }
  );
});

export const GET = withLoggerAndErrorHandler(async () => {
  const { userId } = await auth();

  if (!userId) {
    return errorResponse("Unauthorized", 401);
  }

  let user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      isSubscribed: true,
      susbscriptionEndsAt: true,
    },
  });

  if (!user) {
    return errorResponse("User not found", 404);
  }

  const now = new Date();

  if (user.susbscriptionEndsAt && user.susbscriptionEndsAt < now) {
    user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isSubscribed: false,
        susbscriptionEndsAt: null,
      },
    });
  }

  return successResponse<SubsriptionResponseData>(
    "Subscription fetched successfully",
    {
      isSubscribed: user.isSubscribed,
      subscriptionEndsAt: user.susbscriptionEndsAt,
    }
  );
});
