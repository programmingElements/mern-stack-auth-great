import mongoose from "mongoose";
import { MONGODB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        const connInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${MONGODB_NAME}`);
        console.log(`MongoDB connected successfully! DB Host: ${connInstance.connection.host} | DB Name: ${connInstance.connection.name}`);
    } catch (err) {
        console.log(`MongoDB connection failed!`, err);
        process.exit(1);
    }
}

export default connectDB;