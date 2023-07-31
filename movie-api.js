const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const PORT = 3000

const app = express()
app.use(cors())


const uri = "";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let movieList = [
  'Themm Avengers', 
  'All Dogs Go To Heaven', 
  'The Aristocats', 
  'The Brave Little Toaster', 
  'The Lord of the Rings', 
  'The Revenant', 
  'Cats & Dogs'
];

app.route('/all')
  .get(async (req, res) => {
    let result = [];
    let error = null;
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      const collection = client.db("basicdb").collection("inventory");
      // finds all items in the collection
      result = await collection.find({}).toArray();
  
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (e) {
      console.dir(e)
      error = e;
    }
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
    
    if (error === null) {

      res.json(result.map((value) => {
        return value.title;
      }))
    }
    else {
      res.status(500).send("Failure");
    }
  })
  .delete(async (req, res) => {
    movieList = [];
    res.sendStatus(200)
  })

app.get('/find', (req, res) => {
  console.log(req.query)
  if (req.query.hasOwnProperty('contains')) {
    res.json(movieList.filter((title) => title.toLowerCase().indexOf(req.query.contains.toLowerCase()) > -1))
  }
  else if (req.query.hasOwnProperty('startsWith')) {
    res.json(movieList.filter((title) => title.toLowerCase().indexOf(req.query.startsWith.toLowerCase()) === 0))
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
