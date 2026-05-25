import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths EXCEPT:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico (browser icon)
         * - public assets (images, svgs, etc.)
         *
         * "run middleware on everything that's NOT a static file"
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}