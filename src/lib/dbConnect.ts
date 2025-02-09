import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number,
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected)
    {
        console.log("Already connected to database");
        return
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI || '',{});
        connection.isConnected = mongoose.connections[0].readyState;
        console.log("Connected to database");
    }
    catch (error)
    {
        console.error("Failed to connect to database", error);
        process.exit(1);
    }
}

export default dbConnect;