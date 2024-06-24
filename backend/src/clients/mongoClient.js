const { MongoClient } = require('mongodb');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDb() {
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  return client.db('doda');
}

async function insertMany(collectionName, documents) {
  const db = await connectDb();
  const collection = db.collection(collectionName);
  await collection.insertMany(documents);
}

async function find(collectionName, query) {
  const db = await connectDb();
  const collection = db.collection(collectionName);
  return await collection.find(query).toArray();
}

async function insertOne(collectionName, document) {
  const db = await connectDb();
  const collection = db.collection(collectionName);
  await collection.insertOne(document);
}

async function findOne(collectionName, query) {
  const db = await connectDb();
  const collection = db.collection(collectionName);
  return await collection.findOne(query);
}

module.exports = {
  connectDb,
  insertMany,
  find,
  insertOne,
  findOne,
};
