const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const PORT = 3000
const envDB = `${process.env.dbName}`
const envInventory = `${process.env.dbCollectionName}`

const app = express()
app.use(cors())


const uri = `mongodb+srv://${process.env.dbUserName}:${process.env.dbPassword}@${process.env.dbCluster}.${process.env.dbMongold}.mongodb.net/?retryWrites=true&w=majority`;
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
      const collection = client.db(envDB).collection(envInventory);
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
    let result = {};
    let error = null;
    try {
      await client.connect();
      const collection = client.db(envDB).collection(envInventory);
      // TODO: UNCOMMENT WHEN READY TO IMPLEMENT DELETE ROUTE
      result = await collection.deleteMany({});
      console.log(result);
    }
    catch(e) {
      console.dir(e)
      error = e;
    }
    finally {
      await client.close();
    }
    if(error === null) {
      res.sendStatus(200);
    } else {
      res.status(500).send("Failure");
    }

  })

app.get('/find', async (req, res) => {
  let result = {};
  let error = null;
  if (req.query.hasOwnProperty('contains')) {
    try {
      await client.connect();
      const collection = client.db(envDB).collection(envInventory);
      // Alternative regex
      // result = await collection.find({
      //   title: {
      //     $regex: req.query.contains,
      //     $options: 'i' // regex option i = ignore casing
      //   }
      // }).toArray();
      result = await collection.find({
          title: {
              $regex: new RegExp(req.query.contains, 'i')
            }
          }).toArray();
      console.log(result);

      if(error === null) {
        res.json(result.map((value) => {
          return value.title;
        }))
      } else {
        res.status(500).send("Failure");
      }
    }
    catch (e) {
      console.dir(e);
      error = e;
    }
    finally {
      await client.close();
    }
  } else if(req.query.hasOwnProperty('startsWith')) {
    try {
      await client.connect();
      const collection = client.db(envDB).collection(envInventory);
      result = await collection.find({
        title: {
          $regex: new RegExp(req.query.startsWith, 'i')
        }
      }).toArray();
      console.log(result);

      if(error === null) {
        res.json(result.map((value) => {
          return value.title;
        }))
      } else {
        res.status(500).send("Failure");
      }
    }
    catch (e) {
      console.dir(e);
      error = e;
    }
    finally {
      await client.close();
    }
  }
})

app.route('/insert')
  .post(async (req, res) => {
    let error = null;
    let result = {};
    try {
      await client.connect();
      const collection = client.db(envDB).collection(envInventory);
      insertList = [
        { "title": "The Avengers 2" },
        { "title": "All Dogs Go To Heaven 2" },
        { "title": "The Aristocats 2" },
        { "title": "The Brave Little Toaster 2" },
        { "title": "The Lord of the Rings 2" },
        { "title": "The Revenant 2" },
        { "title": "Cats & Dogs 2" }
      ]
      result = await collection.insertMany(insertList);
      console.log(result);

      if(error === null)  {
        res.sendStatus(200);
      } else {
        res.status(500).send("Failure");
      }
    }
    catch(e) {
      console.dir(e);
      error = e;
    }
    finally {
      await client.close();
    }
  })

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
