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


//Listen server on PORT 
app.listen(port, () => {
    console.log(`Ph_Grapher server is running on ${port}`);
})