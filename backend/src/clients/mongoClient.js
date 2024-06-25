import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let dbInstance = null;

async function connectDb() {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db('doda');
    // Send a ping to confirm a successful connection
    await dbInstance.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  return dbInstance;
}

export async function insertMany(collectionName, documents) {
  const db = await connectDb();
  const collection = db.collection(collectionName);
  await collection.insertMany(documents);
}

export async function find(collectionName, query) {
  const db = await connectDb();
  const collection = db.collection(collectionName);
  return await collection.find(query).toArray();
}

export async function insertOne(collectionName, document) {
  const db = await connectDb();
  const collection = db.collection(collectionName);
  await collection.insertOne(document);
}

export async function findOne(collectionName, query) {
  const db = await connectDb();
  const collection = db.collection(collectionName);
  return await collection.findOne(query);
}

export default {
  connectDb,
  insertMany,
  find,
  insertOne,
  findOne,
};
