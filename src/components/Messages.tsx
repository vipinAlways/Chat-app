'use client'
import { cn } from "@/lib/utils";
import { Message } from "@/lib/validators/message";
import React, { FC, useRef, useState } from "react";

interface MessageProps {
  initialMessages:Message[]
  sessionId:string
}
const Messages:FC<MessageProps> = ({initialMessages,sessionId}) => {
  const [messages,setMessages] = useState<Message[]>(initialMessages)
  const scrollDownRef = useRef<HTMLDivElement | null>(null)
  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef}></div>

      {
        messages.map((message,index)=>{
            const isCurrentUSer = message.senderId === sessionId

            const hasNextMessagesFromSameUser = messages[index -1]?.senderId === messages[index].senderId
          return(
            <div key={`${message.id}-${message.timeStamp}`}>
              <div className={cn('')}>

              </div>
            </div>
          )
        })
      }
    </div>
  );
};

export default Messages;
