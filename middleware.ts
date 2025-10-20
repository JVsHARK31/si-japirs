import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(req) {
    // Check if user is authenticated and trying to access auth pages
    const token = req.nextauth.token
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
    
    if (isAuthPage && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    
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

        // Allow auth pages for non-authenticated users
        if (isAuthPage) {
          return true // Let the middleware function handle the redirect
        }

        // Allow public pages for everyone
        if (isPublicPage) {
          return true
        }

        // Protected routes require authentication
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
