//Importing Package and Library
const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
require('dotenv').config();

//Use Middleware
app.use(cors())
app.use(express.json())

//Default or Home path of server
app.get('/', (req, res) => {
    res.send('Ph_Grapher server is running')
})

//MongoDB Client
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<username>:<password>@cluster0.z9hjm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    const database = client.db('phGrapherDB');
    const serviceCollection = database.collection('services')
}

run().catch(err => console.log(err))

//Listen server on PORT 
app.listen(port, () => {
    console.log(`Ph_Grapher server is running on ${port}`);
})