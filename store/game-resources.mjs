import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.TTR_MONGODB_CONNECTION_STRING;

const client = new MongoClient(uri, {
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

export async function GetStatusAsync(gameId) {
    try {
        await client.connect();

        const database = client.db("sample_mflix");
        const collection = database.collection("users");

        const query = { email: 'mark_addy@gameofthron.es' };

        const options = {
            sort: { email: 1 },
            projection: { _id: 1,  name: 0, password: 0 },
          };

        const result = await collection.findOne(query, options);

        const isReady = Math.random() * 8 < 1;

        if (isReady) {
          // initGame(gameId);
        }

        return isReady;
    } finally {
        await client.close();
    }   
}