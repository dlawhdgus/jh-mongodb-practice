const { MongoClient } = require("mongodb")
const uri = "mongodb+srv://dlawhdgus:dlawhdgus1111@cluster0.722x201.mongodb.net/?retryWrites=true&w=majority"
// Create a new MongoClient
const client = new MongoClient(uri);
async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Establish and verify connection
    await client.db("db").command({ ping: 1 });
    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
module.exports = {MongoClient, uri}
