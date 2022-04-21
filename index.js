const express = require('express')

const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// user: dbuser1
// pass: TuKAGyXAVaONttf5



const uri = "mongodb+srv://dbuser1:TuKAGyXAVaONttf5@bappy-practice-db.nb2hg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
  try{
    await client.connect();
    const userCollection = client.db("foodExpress").collection("users");

    // get user all
    app.get('/users', async(req, res)=>{
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    })

    // get single user
    app.get('/users/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await userCollection.findOne(query);
      res.send(result)
    })

    // add user
    app.post('/users', async (req, res)=>{
      const newUser = req.body;
      const result =await userCollection.insertOne(newUser);
      console.log('add new user', newUser);
      res.send(result)
    })

    // update user
    app.put('/users/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const updatedUser = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email
        }
      };
      const result = await userCollection.updateOne(query, updateDoc, options);
      
        res.send(result);
    })


    // user delete
    app.delete('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      
        res.send(result);
      
    })
  }
  finally{
    // await client.close();
  }

}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})