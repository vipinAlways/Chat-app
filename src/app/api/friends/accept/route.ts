"use server";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { topusherKey } from "@/lib/utils";
import { getServerSession, User } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);

    if (!session) return new Response("Unauthorized", { status: 401 });

    const isAlreadyFriend = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriend.result) {
      return new Response("Already friend", { status: 402 });
    }

    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );

    if (!hasFriendRequest.result) {
      return new Response("No friend request", { status: 404 });
    }

    const [userRaw, friendRaw] = await Promise.all([
      fetchRedis(`get`, `user:${session.user.id}`),
      fetchRedis(`get`, `user:${idToAdd}`),
    ]);

    const user = JSON.parse(userRaw.result) as User;
    const friend = JSON.parse(friendRaw.result) as User;

    await Promise.all([
      pusherServer.trigger(
        topusherKey(`user:${idToAdd}:friends`),
        "new-friend",
        user
      ),
      pusherServer.trigger(
        topusherKey(`user:${session.user.id}:friends`),
        "new-friend",
        friend
      ),
      await db.sadd(`user:${session.user.id}:friends`, idToAdd),
      await db.sadd(`user:${idToAdd}:friends`, session.user.id),

      await db.srem(
        `user:${session.user.id}:incoming_friend_requests`,
        idToAdd
      ),
    ]);



    return new Response("OK");
  } catch (error) {
    console.log(error, "error while accepting");

    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
