const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s88xr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");

    app.post('/addProduct', (req, res) => {
        const products = req.body; //request body theke data thik moto ashte hoile we need body-parser and also CORS.
        productCollection.insertOne(products)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount);
            });
    });

    app.get('/products', (req, res) => {
        // productCollection.find({}).limit(20)
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.get('/product/:key', (req, res) => {
        productCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0]); //Jaate Client side e error na khai, ekebare object hishebe pathay dewa hoise.
            })
    });

    app.post('/productByKeys', (req, res) => {
        const productKeys = req.body;
        productCollection.find({ key: { $in: productKeys } }) //Check mongodb documentation
        .toArray((err,documents) => {
            res.send(documents);
        })
    });

    app.post('/addOrder', (req, res) => {
        const orders = req.body; //request body theke data thik moto ashte hoile we need body-parser and also CORS.
        ordersCollection.insertOne(orders)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0);
            });
    });
});


app.listen(port);