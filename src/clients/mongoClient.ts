import { Db, MongoClient, ServerApiVersion } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error('Environment variable MONGODB_URI must be set');
}

const client = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbInstance: Db | null = null;

async function connectDb() {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db('doda');
    // Send a ping to confirm a successful connection
    await dbInstance.command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  }
  return dbInstance;
}

export async function insertMany(collectionName: string, documents: any[]) {
  const db = await connectDb();
  const collection = db.collection(collectionName);
  await collection.insertMany(documents);
}

export async function find(collectionName: string, query: any, options?: any) {
  const db = await connectDb();
  const collection = db.collection(collectionName);
  return await collection.find(query, options).toArray();
}

export async function insertOne(collectionName: string, document: any) {
  const db = await connectDb();
  const collection = db.collection(collectionName);
  await collection.insertOne(document);
}

export async function findOne(collectionName: string, query: any) {
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
