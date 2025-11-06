export { auth as middleware } from "@/auth";

// direct to login page
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png|login).*)"],
};
