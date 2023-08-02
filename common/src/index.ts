import {z} from 'zod';

export const signInput = z.object({
    username: z.string(),
    password: z.string()
})

export type SignUpParams=z.infer<typeof signInput>;