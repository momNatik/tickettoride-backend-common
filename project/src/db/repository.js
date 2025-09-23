import { MongoClient, ServerApiVersion } from "mongodb";
const DB_CONNECTION_STRING = process.env.TTR_MONGODB_CONNECTION_STRING;
const DB = process.env.DB_NAME;
const COLLECTION = process.env.COLLECTION_GAME;
const client = new MongoClient(DB_CONNECTION_STRING, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
export async function CheckHealthAsync() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        await client.close();
    }
}
export async function CreateAsync(document) {
    return await ExecuteOnDB(async (collection) => await InternalCreateAsync(collection, document));
}
export async function UpdateAsync(document) {
    return await ExecuteOnDB(async (collection) => await InternalUpdateAsync(collection, document));
}
export async function GetAsync(documentId) {
    return await ExecuteOnDB(async (collection) => await InternalGetAsync(collection, documentId));
}
async function InternalCreateAsync(collection, document) {
    return await collection.insertOne(document);
}
async function InternalUpdateAsync(collection, document) {
    const query = { _id: document._id };
    const update = { $set: document };
    return await collection.updateOne(query, update);
}
async function InternalGetAsync(collection, documentId) {
    const query = { _id: documentId };
    return await collection.findOne(query, {});
}
async function ExecuteOnDB(handlerAsync) {
    try {
        await client.connect();
        const database = client.db(DB);
        const collection = database.collection(COLLECTION);
        return await handlerAsync(collection);
    }
    finally {
        await client.close();
    }
}
