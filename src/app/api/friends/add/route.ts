import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addFriendValidator } from "@/lib/validators/add-friend";

import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    const idToAdd = await fetchRedis(
      "get",
      `user:email:${emailToAdd}`
    )
    console.log(idToAdd.result);
    if (!idToAdd.result) {
      console.log("nahi mila");
      return new Response("This person does not exist.", { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (idToAdd.result === session.user.id) {
      return new Response("You cannot add yourself as a friend", {
        status: 400,
      });
    }

    const isAlreadyAdded = await fetchRedis(
      "sismember",
      `user:${idToAdd.result}:incoming_friend_requests`,
      session.user.id
    )
    console.log(isAlreadyAdded,'hain kya ye ');

    if (isAlreadyAdded.result) {
      return new Response("Already added this user", { status: 400 });
    }

    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd.result
    )

    if (isAlreadyFriends.result) {
      return new Response("Already friends with this user", { status: 400 });
    }

    await db.sadd(`user:${idToAdd.result}:incoming_friend_requests`, session.user.id);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
