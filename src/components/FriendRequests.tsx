"use client";
import axios from "axios";
import { Check,  UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";


interface FriendRequestProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionID: string;
}
const FriendRequests: FC<FriendRequestProps> = ({
  incomingFriendRequests,
  sessionID,
}) => {
  const [friendRequest, setFriendRequest] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );
  const router = useRouter()

  const acceptFriend = async (senderId: string) => {
    await axios.post('/api/friends/accept', { id: senderId })

    setFriendRequest((prev) =>
      prev.filter((request) => request.senderID !== senderId)
    )

    router.refresh()
  }
  const denyFriend = async (senderID:string)=>{
    await axios.post('/api/request/deny',{id:senderID})

    setFriendRequest((prev)=>prev.filter((request)=>request.senderID !== senderID))

    router.refresh()
  }
  return (
    <div>
      {friendRequest.length === 0 ? (
        <div>
          <p className="text-sm text-zinc-500 ">Nothing to show here ...</p>
        </div>
      ) : (
        friendRequest.map((request) => (
          <div className="flex gap-4 items-center" key={request.senderID}>
            <UserPlus className="text-black" />
            <p className="font-medium text-lg">{request.senderEmail}</p>

            <button
              aria-label="acceptFriend"
              className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md text-white p-1.5"
                onClick={()=>acceptFriend(request.senderID)}
            >
              <Check className="font-semibold text-white w-3/4 h-3/4" />
            </button>
            <button aria-label="deny-friend" className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md text-white p-1.5">
              <X className="font-semibold text-white w-3/4 h-3/4" />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendRequests;
