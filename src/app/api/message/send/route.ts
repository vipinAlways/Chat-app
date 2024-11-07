"use server";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { messageValidator } from "@/lib/validators/message";
import { pusherServer } from "@/lib/pusher";
import { topusherKey } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json("unauthorized", { status: 401 });

    const [userId1, userId2] = chatId.split("--");

    if (session?.user.id !== userId1 && session.user.id !== userId2) {
      return NextResponse.json("unauthorized", { status: 401 });
    }

    const friendId = session.user.id === userId1 ? userId2 : userId1;
    const friendlist = await fetchRedis(
      "smembers",
      `user:${session.user.id}:friends`
    );
    console.log(friendlist.result, "check this out");

    const isFriends = friendlist.result.includes(friendId);

    if (!isFriends) {
      return NextResponse.json("unauthorized", { status: 401 });
    }

    const sender = await fetchRedis("get", `user:${session.user.id}`);

    const parseSender = JSON.parse(sender.result) as User;
    const timestamp: number = Date.now();
    console.log(typeof timestamp, "ye hain tiem ");
    // console.log(parseSender);
    const messageData: Message = {
      id: nanoid(),
      senderID: session.user.id,
      text,
      timestamp,
    };

    const message = messageValidator.parse(messageData);

    await pusherServer.trigger(
      topusherKey(`chat:${chatId}`),
      "incoming-message",
      message
    );

    pusherServer.trigger(topusherKey(`user:${friendId}:chats`),'new-message',{
      ...message,senderImage:parseSender.image,senderName:parseSender.name
    })

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new NextResponse("ok");
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse("internal server issue", { status: 500 });
  }
}
