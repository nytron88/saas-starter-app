import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { errorResponse } from "./lib/responseWrapper";
import type { UserRole } from "@/types/globals";

interface UserWithRole {
  id: string;
  role: UserRole;
}

const isPublicRoute = createRouteMatcher(["/sign-in", "/sign-up", "/"]);
const isPublicApiRoute = createRouteMatcher(["/api/webhook/register"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

const ROUTES = {
  SIGN_IN: "/sign-in",
  DASHBOARD: "/dashboard",
  ADMIN_DASHBOARD: "/admin/dashboard",
} as const;

const createRedirectResponse = (url: string, req: NextRequest) => {
  return NextResponse.redirect(new URL(url, req.url));
};

const createUnauthorizedResponse = () => {
  return errorResponse("Unauthorized", 401);
};

const getUserWithRole = async (
  userId: string
): Promise<UserWithRole | null> => {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role || "user";

    return {
      id: user.id,
      role,
    };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};

const handleAuthenticatedUser = async (
  userId: string,
  req: NextRequest
): Promise<NextResponse | null> => {
  const userWithRole = await getUserWithRole(userId);

  if (!userWithRole) {
    console.error(`Failed to fetch user data for userId: ${userId}`);
    return createUnauthorizedResponse();
  }

  const { role } = userWithRole;
  const { pathname } = req.nextUrl;

  if (role === "admin" && pathname === ROUTES.DASHBOARD) {
    return createRedirectResponse(ROUTES.ADMIN_DASHBOARD, req);
  }

  if (role !== "admin" && isAdminRoute(req)) {
    return createRedirectResponse(ROUTES.DASHBOARD, req);
  }

  if (isPublicRoute(req)) {
    const targetRoute =
      role === "admin" ? ROUTES.ADMIN_DASHBOARD : ROUTES.DASHBOARD;
    return createRedirectResponse(targetRoute, req);
  }

  return null;
};

const handleUnauthenticatedUser = (req: NextRequest): NextResponse => {
  if (isPublicRoute(req) || isPublicApiRoute(req)) {
    return NextResponse.next();
  }

  return createRedirectResponse(ROUTES.SIGN_IN, req);
};

export default clerkMiddleware(async (auth, req) => {
  try {
    const { userId } = await auth();
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");

    if (isApiRoute) {
      if (isPublicApiRoute(req)) {
        return NextResponse.next();
      }

      if (!userId) {
        return createUnauthorizedResponse();
      }

      return NextResponse.next();
    }

    if (userId) {
      const response = await handleAuthenticatedUser(userId, req);
      return response || NextResponse.next();
    } else {
      return handleUnauthenticatedUser(req);
    }
  } catch (error) {
    console.error("Middleware error:", error);

    if (req.nextUrl.pathname.startsWith("/api")) {
      return errorResponse("Internal server error", 500);
    }

    return createRedirectResponse(ROUTES.SIGN_IN, req);
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
