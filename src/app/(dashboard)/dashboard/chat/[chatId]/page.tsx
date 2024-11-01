import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validators/message";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React, { FC } from "react";

interface pageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const result: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );
    const dbMessages = result.map((message) => JSON.parse(message) as Message);
    const reverseDbMessages = dbMessages.reverse();
    const messges = messageArrayValidator.parse(reverseDbMessages);

    return messges;
  } catch (error) {
    notFound();
  }
}  
const page: FC<pageProps> = async ({ params }) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;
  const [userId1, userId2] = chatId.split("--");

  if (user.id !== userId1 && user.id !== userId2) {
    notFound();
  }

  const chatpartnerID = user.id === userId1 ? userId1 : userId2;

  const chatPartner = await db.get(`user:${chatpartnerID} as user`);

  const initialmessages = await getChatMessages(chatId);

  return <div>{chatId}</div>;
};

export default page;
