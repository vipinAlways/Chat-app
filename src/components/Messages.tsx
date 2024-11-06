"use client";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/validators/message";
import { timeStamp } from "console";
import React, { FC, useRef, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { User } from "next-auth";

interface MessageProps {
  initialMessages: Message[];
  sessionId: string;
  sessionImg: string | undefined;
  chatPartner: User;
}
const Messages: FC<MessageProps> = ({
  initialMessages,
  sessionId,
  sessionImg,
  chatPartner,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const formateTimestamp = (timestamp: number) => {
    return format(timestamp, "HH:mm");
  };
  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef}></div>

      {messages.map((message, index) => {
        const isCurrentUSer = message.senderId === sessionId;

        const hasNextMessagesFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId;
        return (
          <div key={`${message.id}-${message.timestamp}`}>
            <div
              className={cn("flex items-end", { "justify-end": isCurrentUSer })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUSer,
                    "order-2 items-start": !isCurrentUSer,
                  }
                )}
              >
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-indigo-600 text-white": isCurrentUSer,
                    "bg-gray-200 text-gray-900": !isCurrentUSer,
                    "rounded-br-none":
                      !hasNextMessagesFromSameUser && isCurrentUSer,
                    "rounded-bl-none":
                      !hasNextMessagesFromSameUser && !isCurrentUSer,
                  })}
                >
                  {message.text}{" "}
                  <span className="ml-2 text-xs text-gray-400">
                    {formateTimestamp(message.timestamp)}
                  </span>
                </span>
              </div>

              <div
                className={cn("relative w-6 h-6", {
                  "order-2": isCurrentUSer,
                  "order-1": !isCurrentUSer,
                  invisible: hasNextMessagesFromSameUser,
                })}
              >
                <Image
                  fill
                  src={
                    isCurrentUSer
                      ? (sessionImg as string)
                      : (chatPartner.image as string)
                  }
                  className="rounded-full"
                  alt="Profile picture"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
