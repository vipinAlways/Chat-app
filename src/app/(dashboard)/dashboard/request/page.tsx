import FriendRequests from "@/components/FriendRequests";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession, User } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const incomingSenderId = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) 

  const incomingFriendRequest  = await Promise.all(
    incomingSenderId.result.map(async (senderID: string) => {
        const sender = await fetchRedis('get',`user:${senderID}`) 
        
        const senderEmail = JSON.parse(sender.result) as User
     
        return {
            senderID,
            senderEmail: senderEmail.email
        }
    })
  )

  
  return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
      <div className="flex flex-col gap-4">
      <FriendRequests incomingFriendRequests={incomingFriendRequest} sessionID={session.user.id} />
      </div>
      
    </main>
  )
};

export default page;
