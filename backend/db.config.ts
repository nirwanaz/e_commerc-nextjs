import mongoose from 'mongoose';

const dbConnect = () => {
    if (mongoose.connection.readyState >= 1) {
        return
    }

    const DB_URI = process.env.DB_URI;

    mongoose.set("strictQuery", false);
    mongoose.connect(<string>DB_URI);
};

export default dbConnect;