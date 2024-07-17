import { auth } from "@/auth"; // Import the auth function from the auth module

// Define and export the middleware function
export const middleware = auth(async (req) => {
  const pathname = req.nextUrl.pathname; // Get the current request pathname

  if (req.auth) {
    // Check if the user is authenticated
    if (pathname.startsWith("/login")) {
      // If the user is authenticated and trying to access the login page, redirect to the home page
      return Response.redirect(new URL("/", req.url));
    }
  } else {
    if (!pathname.startsWith("/login")) {
      // If the user is not authenticated and not trying to access the login page, redirect to the login page
      return Response.redirect(new URL("/login", req.url));
    }
  }
});

// Export the configuration object for the middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Define paths to match for the middleware
};
