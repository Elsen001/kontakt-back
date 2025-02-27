import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1
});

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB bağlantısı uğurla quruldu!");
  } catch (err) {
    console.error("❌ MongoDB bağlantı xətası:", err);
  }
}

connectDB();
export default client;
