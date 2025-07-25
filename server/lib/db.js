import mongoose from "mongoose";

// function to connect to mongodb database
export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"));
        await mongoose.connect(`${process.env.MONGO_URI}/quick-chat`)
    } catch (error) {
        console.log(error);
    }
}