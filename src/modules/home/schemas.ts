import z from "zod";

export const ChangeStateSchema = z.object({
    name: z.string(),
    code: z.string(),
    oldState: z.string(),
    newState: z.string(),
    timesStamp: z.date(),
})
