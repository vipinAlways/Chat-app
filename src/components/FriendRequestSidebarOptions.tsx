"use client";
import { Divide, User } from "lucide-react";
import Link from "next/link";
import React, { FC, useState } from "react";

interface FriendRequestSidebarOptionsProps {
    initialUnseenRequestCount:number,
    sessionId:string
}
const FriendRequestSidebarOptions:FC<FriendRequestSidebarOptionsProps> =({
    sessionId,
    initialUnseenRequestCount
})=>{
    const [unseenRequest,setUnseenRequest] = useState<number>(initialUnseenRequestCount)
  return(
    <Link href='/dashboard/request' className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
        <div className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                <User className="h-4 w-4"/>
        </div>
        <p className="truncate">Friend Requests</p>

        {
            unseenRequest > 0  ?  (
                <div className="rounded-full w-5 h-5 text-xs flex items-center justify-center text-white bg-indigo-600 text-center">
                    {unseenRequest}
                </div>
            ) : null
        }
    </Link>
  )
}

export default FriendRequestSidebarOptions;
