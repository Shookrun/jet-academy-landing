/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getToken } from "next-auth/jwt";
import { RiTiktokLine } from "react-icons/ri";

export enum Role {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  USER = "USER",
  CRMOPERATOR = "CRMOPERATOR",
  CONTENTMANAGER = "CONTENTMANAGER",
}

const ROUTE_PERMISSIONS = {
  COMMON: ["/dashboard/login"],

  ADMIN_ONLY: [
    "/dashboard/admin",
    "/dashboard/settings",
    "/dashboard/users",
    "/dashboard/users/create",
    "/dashboard/users/edit",
    "/dashboard/contact-info",
  ],

  STAFF: [
    "/dashboard/student-projects",
    "/dashboard/student-projects/create",
    "/dashboard/student-projects/edit",
    "/dashboard/team",
    "/dashboard/team/create",
    "/dashboard/team/edit",
    "/dashboard/requests",
    "/dashboard/exams",
    "/dashboard/gallery",
    "/dashboard/gallery/create",
  ],

  USER: ["/dashboard/profile"],

  CRMOPERATOR: ["/dashboard/requests"],

  CONTENTMANAGER: [
    "/dashboard/student-projects",
    "/dashboard/student-projects/create",
    "/dashboard/student-projects/edit",
    "/dashboard/gallery",
    "/dashboard/gallery/create",
    "/dashboard/courses",
    "/dashboard/posts",
    "/dashboard/posts/create",
    "/dashboard/posts/edit",
    "/dashboard/team",
    "/dashboard/team/create",
    "/dashboard/team/edit",
    "/dashboard/glossary",
    "/dashboard/glossary/create",
    "/dashboard/glossary/edit",
  ],
};

const ROLE_HOME_PAGES = {
  [Role.ADMIN]: "/dashboard/requests",
  [Role.STAFF]: "/dashboard/requests",
  [Role.USER]: "/dashboard/requests",
  [Role.CRMOPERATOR]: "/dashboard/requests",
  [Role.CONTENTMANAGER]: "/dashboard/student-projects",
};

const intlMiddleware = createIntlMiddleware(routing);

/**
 * Checks if a pathname matches any route in the provided routes array
 */
const pathMatches = (pathname: string, routes: string[]): boolean => {
  if (routes.includes(pathname)) {
    return true;
  }

  return routes.some((route) => {
    if (route.endsWith("/edit") || route.endsWith("/create")) {
      const baseRoute = route.split("/").slice(0, -1).join("/");
      return (
        pathname.startsWith(baseRoute + "/") &&
        (pathname.includes("/edit/") || pathname.includes("/create/"))
      );
    }
    return false;
  });
};

/**
 * Determines if a user with the given role has access to the specified path
 */
const hasRouteAccess = (pathname: string, role: Role): boolean => {
  if (pathMatches(pathname, ROUTE_PERMISSIONS.COMMON)) {
    return true;
  }

  if (pathname === "/dashboard") {
    return true;
  }

  if (role === Role.ADMIN) {
    return true;
  }

  switch (role) {
    case Role.STAFF:
      return pathMatches(pathname, ROUTE_PERMISSIONS.STAFF);
    case Role.USER:
      return pathMatches(pathname, ROUTE_PERMISSIONS.USER);
    case Role.CRMOPERATOR:
      return pathMatches(pathname, ROUTE_PERMISSIONS.CRMOPERATOR);
    case Role.CONTENTMANAGER:
      return pathMatches(pathname, ROUTE_PERMISSIONS.CONTENTMANAGER);
    default:
      return false;
  }
};

/**
 * Gets the appropriate home page URL for a given role
 */
const getRoleHomePage = (role: Role, request: Request): URL => {
  const homePath = ROLE_HOME_PAGES[role] || "/dashboard/profile";
  return new URL(homePath, request.url);
};

const middlewares = withAuth(
  async function middleware(request) {
    const pathname = request.nextUrl.pathname;

    if (pathname.match(/^\/(az|en)\/dashboard\/login/)) {
      const newUrl = new URL(pathname.replace(/^\/(az|en)/, ""), request.url);
      return NextResponse.redirect(newUrl);
    }

    if (pathname.startsWith("/dashboard")) {
      if (pathname === "/dashboard/login") {
        const token = await getToken({ req: request });
       
        if (token) {
          const roleName = (token.role as Role) || Role.USER;
          return NextResponse.redirect(getRoleHomePage(roleName, request));
        }
        return NextResponse.next();
      }

      const token = await getToken({ req: request });
      if (!token) {
        const loginUrl = new URL("/dashboard/login", request.url);
        if (pathname !== "/dashboard/login") {
          loginUrl.searchParams.set("callbackUrl", pathname);
        }
        return NextResponse.redirect(loginUrl);
      }

      const userRole = (token.role as Role) || Role.USER;

      if (pathname === "/dashboard") {
        return NextResponse.redirect(getRoleHomePage(userRole, request));
      }

      if (!hasRouteAccess(pathname, userRole)) {
        return NextResponse.redirect(getRoleHomePage(userRole, request));
      }

      return NextResponse.next();
    }

    return intlMiddleware(request);
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
    pages: {
      signIn: "/dashboard/login",
    },
  }
);

export default middlewares;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!api|_next|public|_vercel|.*\\..*|favicon.ico).*)",
    "/",
    "/(az|en)/:path*",
  ],
};
