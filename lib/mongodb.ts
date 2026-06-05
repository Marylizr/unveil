import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/unveil";

interface GlobalWithMongoose {
  mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

declare const global: GlobalWithMongoose;

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (global.mongoose.conn) return global.mongoose.conn;

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(MONGODB_URI).then((mg) => mg);
  }

  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

export default connectDB;
