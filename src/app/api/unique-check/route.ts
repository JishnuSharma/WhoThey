import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";

import { userNameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchama = z.object({
    username: userNameValidation,
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        };

        const result = usernameQuerySchama.safeParse(queryParam);

        if(!result.success)
        {
            const usernameError = result.error.format().username?._errors || [];

            return Response.json({
                success: false,
                message: usernameError?.length > 0 ? usernameError.join(', ') : "Invalid query parameter",
            }, {
                status: 400
            });  
        }

        const { username } = result.data;

        const exististingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if(exististingVerifiedUser)
        {
            return Response.json({
                success: false,
                message: "Username is already taken",
            }, {
                status: 400
            });
        }

        return Response.json({
            success: true,
            message: "Username is available",
        });
    } 
    catch(error)
    {
        console.log("Error checking username", error);

        return Response.json({
            success: false,
            message: "Error checking username",
        }, {
            status: 500
        })
    }
}