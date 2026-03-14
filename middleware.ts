import { auth, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home"
]);

const isApiAuthRoute = createRouteMatcher([
    "/api/cloudinary-signature",
    "/api/video/save",
    "/api/video",
    "/api/videoUpload"
]);

export default clerkMiddleware(async (auth, req) => {
    const {userId} = await auth();
    const currentUrl = new URL(req.url);
    const isHomepage = currentUrl.pathname === "/home";
    const isApiRequest = currentUrl.pathname.startsWith("/api");
    const isAuthPage = currentUrl.pathname.startsWith("/sign-in") || currentUrl.pathname.startsWith("/sign-up");

    // Redirect logged-in users away from public pages (except home)
    if (userId && isPublicRoute(req) && !isApiRequest && !isAuthPage && !isHomepage) { 
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Not logged in
    if (!userId) {
        // API routes that need auth - let them through to return 401
        if (isApiAuthRoute(req)) {
            return NextResponse.next();
        }
        
        // Protected page routes - redirect to sign-in
        if (!isPublicRoute(req)) {
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }
    }
    
    return NextResponse.next();
});

export const config = {
  matcher:["/((?!.*\\..*|_next).*)","/","/api|trpc)(.*)"],
};
