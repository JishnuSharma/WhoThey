import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();

        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        const isCodeValid =
            user.verifyCode === code &&
            new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid) {
            user.isVerified = true;
            await user.save();

            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully",
                },
                {
                    status: 200,
                }
            );
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Code is either invalid or expired",
                },
                {
                    status: 400,
                }
            );
        }
    } catch (error) {
        console.log("Error verifying user: ", error);

        return Response.json(
            {
                success: false,
                message: "Error verifying user",
            },
            {
                status: 500,
            }
        );
    }
}
