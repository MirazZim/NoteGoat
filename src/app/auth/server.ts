import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const client = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  return client
}

export async function getUser() {
   const {auth} = await createClient()

   try {
     const userObject = await auth.getUser()

     if(userObject.error) {
       // Don't log auth session missing errors as they're expected when logged out
       if (userObject.error.message !== "Auth session missing!") {
         console.log(userObject.error)
       }
       return null
     }

     return userObject.data.user
   } catch (error) {
     console.error("Error getting user:", error)
     // Catch any auth errors and return null instead of throwing
     return null
   }
}