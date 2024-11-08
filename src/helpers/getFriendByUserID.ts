

import { fetchRedis } from "./redis";

export async function getFriendByUserID(userId:string){
    const friendIds = await fetchRedis('smembers', `user:${userId}:friends` )
    
    const friends = await Promise.all(
        friendIds.result.map(async (friendId:string)=>{
            const friend = await fetchRedis('get',`user:${friendId}`)
            return friend.result
        })
    )

    return friends
}
