const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectID;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

//database connectio
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5yvtj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productCollection = client.db("FressFood").collection("Foods");
  const ordersCollection = client.db("FressFood").collection("Orders");

  //get api for get all data from database
  app.get("/allProduct", (req, res) => {
    productCollection.find({}).toArray((error, products) => {
      res.send(products);
    });
  });

  //post api for send image and data in database for home page
  app.post("/addProduct", (req, res) => {
    const newItem = req.body;
    productCollection.insertOne(newItem).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //delet api for delet data from database
  app.delete("/deletProduct/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    productCollection.findOneAndDelete({ _id: id }).then((data) => {
      res.send({ success: !!data.value });
    });
  });

  //get api for get specific  data from database
  app.get("/product/:id", (req, res) => {
    const id = ObjectID(req.params.id);

    productCollection.find({ _id: id }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  //post api for send order data in batabase
  app.post("/addOrder", (req, res) => {
    const order = req.body;
    console.log(order);
    ordersCollection.insertOne(order).then((result) => {
      console.log("order success", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  //find data by email from database
  app.get("/booking", (req, res) => {
    ordersCollection
      .find({ orderOwnerEmail: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
