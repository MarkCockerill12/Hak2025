import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  // Only allow public access to homepage, sign-in, and sign-up pages
  publicRoutes: ["/", "/sign-in", "/sign-up"],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}