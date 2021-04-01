const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const objectID = require('mongodb').ObjectID;
const { ObjectId } = require('bson');

const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = process.env.PORT || 5055







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fckrr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const productsCollection = client.db("freshGarden").collection("products");
  console.log('database connection successful');
  const productCollection = client.db("user").collection("order");

  app.post('/addProduct', (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      productsCollection.insertOne(newProduct)
      .then(result => console.log('added successfully'))
      .catch(err => console.error(err))
  })
  
  app.get('/products', (req, res) => {
      productsCollection.find({})
      .toArray((err, documents) =>{
          res.send(documents)

      })
  })
  
  app.delete('/delete/:e', (req, res) => {
      console.log(req.params.e);
      productsCollection.deleteOne({_id: ObjectId(req.params.e)})
      .then( (result)=>{
        console.log(result)
        res.send(result.deletedCount > 0);
      })
  })


  app.get('/checkOut/:id', (req, res) => {
    console.log(req.params.id)
    productsCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) =>{
      res.send(documents[0])
      console.log(documents[0]);

  })
  })


  app.post('/orderData', (req, res)=>{
    const userOrder = req.body;
    productCollection.insertOne(userOrder)
      .then(result => console.log('added successfully'))
      .catch(err => console.error(err))

  })

  app.get('/orders/:email', (req, res)=>{
    console.log(req.params.email)
    // const productCollection = client.db("user").collection("order");
    productCollection.find({email:req.params.email})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })
  
});







app.listen(port)