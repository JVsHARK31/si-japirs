import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const isAuth = !!token
        const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
        const isPublicPage = req.nextUrl.pathname === "/" || 
                            req.nextUrl.pathname.startsWith("/api") ||
                            req.nextUrl.pathname.startsWith("/_next") ||
                            req.nextUrl.pathname.includes(".")

        if (isAuthPage) {
          if (isAuth) {
            return Response.redirect(new URL("/dashboard", req.url))
          }
          return true
        }

        if (isPublicPage) {
          return true
        }

        return isAuth
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
}
