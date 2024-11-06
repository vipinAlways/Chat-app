import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validators/message";
import { getServerSession, User } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import React, { FC } from "react";

interface pageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const respo = await fetchRedis("zrange", `chat:${chatId}:messages`, 0, -1);

    const result: string[] = respo.result;

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

  const chatpartnerID = user.id === userId1 ? userId2 : userId1;
  const chatPartnerRaw = (await fetchRedis(
    'get',
    `user:${chatpartnerID}`
  )) 

  const chatPartner = JSON.parse(chatPartnerRaw.result ) as User;
  
  const initialmessages = await getChatMessages(chatId);

  return (
    <div className="flex flex-1 justify-between flex-col h-full max-h-[calc(100vh-6rem)] ">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200 ">
        <div className="relative flex items-center space-x-4">
          <div className=" relative">
            <div className=" relative w-8 sm:w-12 h-8 sm:h-12">
              <Image
              fill
              referrerPolicy="no-referrer"
              src={chatPartner.image!}
              alt={`${chatPartner.name} profile picture`}
              className="rounded-full"
              />

            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className=" text-xl flex items-center">
              <span className="text-gray-700 mr-2 font-semibold">{chatPartner.name}</span>
            </div>

            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>
      <Messages chatPartner={chatPartner} sessionImg={session.user.image!} initialMessages={initialmessages} sessionId={session.user.id}/>

      <ChatInput chatPartner={chatPartner} chatId={chatId}/>
    </div>
  );
};

export default page;
