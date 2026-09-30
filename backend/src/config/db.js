import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log('Connecting to provided MongoDB URI (Atlas)...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✅ Connected to MongoDB Atlas successfully.');
      return;
    } catch (err) {
      console.warn('⚠️ Atlas connection failed:', err.message);
      console.log('Falling back to local in-memory MongoDB instance for seamless demo...');
    }
  } else {
    console.log('ℹ️ No MONGODB_URI provided in .env. Initializing in-memory MongoDB server...');
  }

  try {
    mongoMemoryServer = await MongoMemoryServer.create({
      instance: {
        launchTimeout: 60000,
      },
    });
    const memoryUri = mongoMemoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`✅ In-Memory MongoDB Server running at: ${memoryUri}`);
  } catch (err) {
    console.error('❌ Failed to start in-memory MongoDB:', err);
    throw err;
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
}
