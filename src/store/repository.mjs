import { MongoClient, ServerApiVersion } from 'mongodb';

const DB_CONNECTION_STRING = process.env.TTR_MONGODB_CONNECTION_STRING;
const DB = "sample_mflix";
const COLLECTION = "games";

const client = new MongoClient(DB_CONNECTION_STRING, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function CheckHealthAsync() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        await client.close();
    }
  }

export async function CreateAsync(game) {
  return await ExecuteOnDB(async collection => await InternalCreateAsync(collection, game));
}

export async function UpdateAsync(game) {
  return await ExecuteOnDB(async collection => await InternalUpdateAsync(collection, game));
}

export async function GetAsync(gameId) {
  return await ExecuteOnDB(async collection => await InternalGetAsync(collection, gameId));
}

async function InternalCreateAsync(collection, game) {
  return await collection.insertOne(game);
}

async function InternalUpdateAsync(collection, game) {
  const query = { id: game.id };
  const update = { $set: game };

  return await collection.updateOne(query, update);
}

async function InternalGetAsync(collection, gameId) {
    const query = { id: gameId };

    return await collection.findOne(query, {});
}

async function ExecuteOnDB(handlerAsync) {
    try {
        await client.connect();

        const database = client.db(DB);
        const collection = database.collection(COLLECTION);

        return await handlerAsync(collection);
    } finally {
        await client.close();
    }   
}