"use client";
import { chatHrefConstructor } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";

interface SideChatListProps {
  friends: User[];
  sessionId: string;
}
const SideChatList: FC<SideChatListProps> = ({ friends, sessionId }) => {
  const router = useRouter();
  const pathName = usePathname();
  const [unSeenMessages, setunSeenMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (pathName?.includes("chat")) {
      setunSeenMessages((prev) => {
        return prev.filter((msg) => !pathName.includes(msg.senderId));
      });
    }
  }, [pathName]);
  return (
    <div>
      <ul role="list" className="max-h-[25rem] overflow-auto -mx-2 space-y-1">
        {friends.sort().map((friend) => {
          const unseenMessageCount = unSeenMessages.filter((unSeenMsg) => {
            return unSeenMsg.senderId === friend.id;
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
                    {
                      unseenMessageCount
                    }
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
