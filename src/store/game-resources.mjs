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
  return await ExecuteOnDB(async collection => await CreateOperationAsync(collection, game));
}

export async function UpdateAsync(game) {
  return await ExecuteOnDB(async collection => await UpdateOperationAsync(collection, game));
}

export async function GetStatusAsync(gameId) {
  return await ExecuteOnDB(async collection => await GetStatusOperationAsync(collection, gameId));
}

async function CreateOperationAsync(collection, game) {
  return await collection.insertOne(game);
}

async function UpdateOperationAsync(collection, game) {
  const query = { id: game.id };
  const update = { $set: game };

  return await collection.updateOne(query, update);
}

async function GetStatusOperationAsync(collection, gameId) {
    const query = { id: gameId };

    const options = {
        // sort: { email: 1 },
        // projection: { _id: 1,  name: 0, password: 0 },
      };

    const game = await collection.findOne(query, options);

    // const isReady = Math.random() * 8 < 1;
    const isReady = game?.isResourcesReady === true;

    return isReady;
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