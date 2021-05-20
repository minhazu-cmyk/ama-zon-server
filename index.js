const express = require('express')
const app = express();
const  bodyParser = require('body-parser');
const cors = require ('cors')
const port = 5000;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

// app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dhmoa.mongodb.net/${process.env.DB_name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
const pass = "CZvYZhmXqDPEdRcQ";





client.connect(err => {
  const  productsCollection= client.db("amajon").collection("product");
  const  ordersCollection= client.db("amajon").collection("order");
  console.log("data connected")
 
  app.post('/addProduct', (req, res) => {
    const products = req.body;
    console.log(products)
    productsCollection.insertMany(products)
    .then(result => {
        console.log(result.insertedCount);
     
        res.send(result.insertedCount);
    })
})
app.get('/products', (req, res) =>{
productsCollection.find({})
.toArray((err,documents)=>{
  res.send(documents);
})
})
app.get('/product/:key', (req, res) =>{
  productsCollection.find({key:req.params.key})
  .toArray((err,documents)=>{
    res.send(documents[0]);
  })
  })
 app.post('/productByKeys',(req, res)=>{
   const productKeys = req.body
   productsCollection.find({key: {$in:productKeys}})
   .toArray((err,documents)=>{
     res.send(documents);
   })
 })

 app.post('/addOrder', (req, res) => {
  const order = req.body;
  
  ordersCollection.insertOne(order)
  .then(result => {
    
   
      res.send(result.insertedCount> 0);
  })
})


app.get('/', (req, res) => {
  res.send('Hello World!')
})
 });
app.listen(port)