import mongoose from "mongoose";
import { environment } from "./environment.js";
export async function connectDatabase() {
    try {
        console.log(`Connecting to MongoDB: ${environment.mongodbUri.replace(/:[^@]+@/, ":****@")}`);
        await mongoose.connect(environment.mongodbUri, {
            retryWrites: true,
            w: "majority",
        });
        console.log("✓ MongoDB connected successfully");
        // Set up connection event handlers
        mongoose.connection.on("disconnected", () => {
            console.warn("MongoDB disconnected");
        });
        mongoose.connection.on("error", (error) => {
            console.error("MongoDB connection error:", error);
        });
        return mongoose.connection;
    }
    catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}
export async function disconnectDatabase() {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
}
//# sourceMappingURL=database.js.map