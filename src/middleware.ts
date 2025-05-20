import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}



export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Check if the request is for the login or sign-up page.
  const isAuthRoute =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/sign-up";

  // If the user is already logged in, redirect them to the homepage.
  if (isAuthRoute) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      return NextResponse.redirect(
        new URL("/", process.env.NEXT_PUBLIC_BASE_URL),
      );
    }
  }

  // Get the search parameters and pathname from the request URL.
  const { searchParams, pathname } = new URL(request.url);

  // If the request is for the homepage, and there is no noteId search parameter,
  // then try to find the newest note for the user.
  if (!searchParams.get("noteId") && pathname === "/") {
    // Get the user from the session.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Get the ID of the newest note for the user.
      const { newestNoteId } = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-newest-note?userId=${user.id}`,
      ).then((res) => res.json());

      // If we found a newest note for the user, redirect to it.
      if (newestNoteId) {
        const url = request.nextUrl.clone();
        url.searchParams.set("noteId", newestNoteId);
        return NextResponse.redirect(url);
      } else {
        // If there is no newest note, create a new one.
        const { noteId } = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-new-notes?userId=${user.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        ).then((res) => res.json());
        const url = request.nextUrl.clone();
        url.searchParams.set("noteId", noteId);
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse
}