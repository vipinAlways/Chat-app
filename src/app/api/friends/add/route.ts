import { addFriendValidator } from "@/lib/validators/add-friend"

export async function POST(req:Request){
    try {
        const body = await req.json()

        const {email:emailTOAdd} = addFriendValidator.parse(body.email)

        
    } catch (error) {
        
    }
}