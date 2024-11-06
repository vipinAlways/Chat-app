import { string, z } from "zod";

export const messageValidator = z.object({
    id:z.string(),
    senderID:z.string(),
    text:z.string(),
    timestamp : z.number()
})

export const messageArrayValidator = z.array(messageValidator)

export type Message= z.infer<typeof messageValidator>