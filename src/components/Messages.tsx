"use client";
import { cn, topusherKey } from "@/lib/utils";
import { Message } from "@/lib/validators/message";
import React, { FC, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { User } from "next-auth";
import { pusherClient } from "@/lib/pusher";

interface MessageProps {
  initialMessages: Message[];
  sessionId: string;
  sessionImg: string | undefined;
  chatPartner: User;
  chatId: string;
}
const Messages: FC<MessageProps> = ({
  initialMessages,
  sessionId,
  sessionImg,
  chatPartner,
  chatId,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const formateTimestamp = (timestamp: number) => {
    return format(timestamp, "HH:mm");
  };

  useEffect(() => {
    pusherClient.subscribe(topusherKey(`chat:${chatId}`));
    const messageHandler = (message:Message) => {
      setMessages((prev) => [message, ...prev]);//this what do 
    };

    pusherClient.bind("incoming-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(topusherKey(`chat:${chatId}`));

      pusherClient.unbind("incoming-message", messageHandler);
    };
  }, [chatId]);
  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto overflow-x-hidden scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef}></div>

      {messages.map((message, index) => {
        const isCurrentUSer = message.senderID === sessionId;

        const hasNextMessagesFromSameUser =
          messages[index - 1]?.senderID === messages[index].senderID;
        return (
          <div key={`${message.id}-${message.timestamp}`}>
            <div
              className={cn("flex items-end", { "justify-end": isCurrentUSer })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2 h-fit",
                  {
                    "order-1 items-end": isCurrentUSer,
                    "order-2 items-start": !isCurrentUSer,
                  }
                )}
              >
                <span
                  className={cn("px-4 py-2 rounded-lg  whitespace-normal break-words text-wrap inline-block max-w-xs max-h-80 overflow-y-auto", {
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
