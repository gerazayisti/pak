import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/auth/login",
  },
})

export const config = {
  matcher: [
    "/",
    "/collecte/:path*",
    "/pretraitement/:path*",
    "/recherche/:path*",
    "/rapports/:path*",
    "/parametres/:path*",
  ],
} 