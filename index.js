const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zjrcntk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const productCollection = client.db("shop").collection("product");

        app.get('/product', async (req, res) => {
            const query = {}
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const cursor = productCollection.find(query)
            let result;
            if (page || size) {
                result = await cursor.skip(page * size).limit(size).toArray()
            }
            else {
                result = await cursor.toArray()
            }
            res.send(result)
        })

        app.get('/productcount', async (req, res) => {
            const countPage = await productCollection.countDocuments();
            res.send({ countPage })
        })

        app.post('/productkeys', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id))
            const query = { _id: { $in: ids } }
            const cursor = productCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

    }
    finally {

    }
};
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('ema jhon shop');
});

app.listen(port, () => {
    console.log('working port', port);
});