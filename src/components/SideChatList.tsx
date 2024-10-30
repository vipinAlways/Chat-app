"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";

interface SideChatListProps {
  friends: User[];
}
const SideChatList: FC<SideChatListProps> = ({ friends }) => {
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
          const unseenMessage = unSeenMessages.filter((unSeenMsg) => {
            return unSeenMsg.senderId === friend.id;
          }).length;
          return (
            <li key={friend.id}>
              <a href={`/dashboard/chat/${unseenMessage}`}>
              hello </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideChatList;