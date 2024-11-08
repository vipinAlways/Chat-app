"use client";
import { useToast } from "@/hooks/use-toast";
import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, topusherKey } from "@/lib/utils";
import { ToastAction } from "@radix-ui/react-toast";

import { usePathname, useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";

interface SideChatListProps {
  friends: User[];
  sessionId: string;
}

interface extentedMessage extends Message {
  senderImage: string;
  senderName: string;
}
const SideChatList: FC<SideChatListProps> = ({ friends, sessionId }) => {
  const router = useRouter();
  const pathName = usePathname();
  const [unSeenMessages, setunSeenMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const [activeChat, setActiveChat] = useState<User[]>(friends)

  useEffect(() => {
    const newFriendHanlder = (newFriend:User) => {
      setActiveChat((prev)=>[...prev,newFriend])
    };
    pusherClient.subscribe(topusherKey(`user:${sessionId}:chats`));

    pusherClient.subscribe(topusherKey(`user:${sessionId}:friends`));
    const chatHandler = (message: extentedMessage) => {
      const shouldNotify =
        pathName !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderID)}`;

      if (shouldNotify) {
        setunSeenMessages((prev) => [...prev, message]); //what does this meens
        toast({
          title: "UnseenMessage",
          description: `${message.senderName}:${message.text.slice(0, 20)} ${
            message.text.length > 20 ? "..." : ""
          }`,
          action: (
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId,
                message.senderID
              )}`}
            >
              <ToastAction
                altText="reidrect to chat"
                className="bg-black text-slate-100 rounded-lg p-2 "
              >
                Chat
              </ToastAction>
            </a>
          ),
        });
      } else {
        return ''
      }
    };
    pusherClient.bind("new-message", chatHandler);
    pusherClient.bind("new-message", newFriendHanlder);

    return () => {
      pusherClient.unsubscribe(topusherKey(`user:${sessionId}:chats`));

      pusherClient.unsubscribe(topusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind("new-message", chatHandler);
      pusherClient.unbind("new-message", newFriendHanlder);
    };
  }, [pathName, router, sessionId, toast]);

  useEffect(() => {
    if (pathName?.includes("chat")) {
      setunSeenMessages((prev) => {
        return prev.filter((msg) => !pathName.includes(msg.senderID));
      });
    }
  }, [pathName, sessionId, router]);
  return (
    <div>
      <ul role="list" className="max-h-[25rem] overflow-auto -mx-2 space-y-1">
        {activeChat.sort().map((friend) => {
          const unseenMessageCount = unSeenMessages.filter((unSeenMsg) => {
            return unSeenMsg.senderID === friend.id;
          }).length;
          return (
            <li key={friend.id}>
              <a
                href={`/dashboard/chat/${chatHrefConstructor(
                  sessionId,
                  friend.id
                )}`}
                className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
              >
                {friend.name}
                {unseenMessageCount > 0 ? (
                  <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center ">
                    {unseenMessageCount}
                  </div>
                ) : null}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideChatList;
