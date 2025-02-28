import { getServerSession } from 'next-auth';
import { getSession, useSession } from 'next-auth/react';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authOptions } from './utils/authOptions';
import { getToken } from 'next-auth/jwt';
 
// Lista de origens permitidas
const allowedOrigins = [
    "http://localhost:3001",
    "http://br5f7-7uaaa-aaaaa-qaaca-cai.localhost:4943",
    // Adicione outras origens aqui
];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET, secureCookie: process.env.NODE_ENV === 'production'});

    if(!session){
        return NextResponse.redirect(new URL('/login', request.url))
    } 

    if(session){
        console.log("mandando para dash.")
        return NextResponse.redirect('http://localhost:3001/dashboard');
    }

    if(request.nextUrl.pathname.startsWith('/')){
        return NextResponse.redirect(new URL('/login', request.url))
    }
    
    return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/']
}