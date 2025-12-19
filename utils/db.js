import mongoose from "mongoose";

const connection = {
  isConnected: false,
};

async function connectDb() {
  if (connection.isConnected) {
    console.log("✅ Using existing database connection");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is not defined");
  }

  if (mongoose.connections.length > 0) {
    const state = mongoose.connections[0].readyState;

    if (state === 1) {
      console.log("♻️ Reusing existing mongoose connection");
      connection.isConnected = true;
      return;
    }

    await mongoose.disconnect();
  }

  const db = await mongoose.connect(process.env.MONGODB_URI);

  console.log("🆕 New database connection established");
  connection.isConnected = db.connections[0].readyState === 1;
}

async function disconnectDb() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;
      console.log("🔌 Database disconnected");
    } else {
      console.log("ℹ️ Not disconnecting DB in development");
    }
  }
}

const db = { connectDb, disconnectDb };
export default db;
