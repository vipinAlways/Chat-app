const upstachRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Commands = "zrange" | "sismember" | "get" | "smembers";

export async function fetchRedis(
  command: Commands,
  ...args: (string | number)[]
) {
  const commadUrl = `${upstachRedisRestUrl}/${command}/${args.join("/")}`;
  const Response = await fetch(commadUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });

  if(!Response.ok) throw new Error(`Error executing Redis command: ${Response.statusText}`)

    const data =await Response.json()
    return data
}


