import type { Session,User } from "next-auth"
import { User } from "next-auth"


type UserId =  string

declare module 'next-auth/jwt' {
    interface JWT {
        id:User.id
    }
}

declare module 'next-auth' {
    interface Session{
        user:User & {
            id:UserId
        }
    }
}