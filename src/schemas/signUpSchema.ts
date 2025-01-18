import { z } from 'zod';

export const userNameValidation = z.string().min(2, "Username must me atleast 2 characters").max(20, "Username must be no more than 20 characters").regex(/^[a-zA-Z0-9 ]*$/, "Username must not contain special characthers");

export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.string().email({
        message: "Invalid email address",
    }),
    password: z.string().min(6, {
        message: "The password must be atleast 6 characters"
    })
})