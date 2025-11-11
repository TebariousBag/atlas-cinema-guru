import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  theme: {
    brandColor: "#1ED2AF",
    logo: "/logo.png",
    buttonText: "#ffffff",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    authorized: async ({ auth, request }) => {
      const isLoggedIn = !!auth;
      const isOnLoginPage = request.nextUrl.pathname === "/login";
      
      // Allow access to login page
      if (isOnLoginPage) {
        // If already logged in, redirect to home
        if (isLoggedIn) {
          return Response.redirect(new URL("/", request.url));
        }
        return true;
      }
      
      // Require authentication for all other pages
      if (!isLoggedIn) {
        return false; // This will redirect to signIn page
      }
      
      return true;
    },
  },
});
