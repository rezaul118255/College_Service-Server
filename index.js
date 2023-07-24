const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ghfcjpf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const menuCollection = client.db("CollegeService").collection("menu");
        const reviewCollection = client.db("CollegeService").collection("reviews");
        const enrollCollection = client.db("CollegeService").collection("enrolled");





        app.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result);
        })
        // app.get('/menu/:id', async (req, res) => {
        //     const id = parseInt(req.params.id);
        //     console.log(id)
        //     const result = menuCollection.find(n => n.id === id)
        //     res.send(result)
        // })

        app.get("/menu/:id", async (req, res) => {
            // console.log(req.params.id)
            const result = await menuCollection.find({ id: req.params.id }).toArray();
            res.send(result)
        })
        app.get("/college/:id", async (req, res) => {
            // console.log(req.params.id)
            const result = await menuCollection.find({ id: req.params.id }).toArray();
            res.send(result)
        })
        app.post("/enroll", async (req, res) => {
            const body = req.body;
            const result = await enrollCollection.insertOne(body)
            console.log(body)
            res.send(result)
        });

        app.get('/enrolled', async (req, res) => {
            const result = await enrollCollection.find().toArray();
            res.send(result);
        })
        app.get("/enrolled/:email", async (req, res) => {
            console.log(req.params.email)
            const result = await enrollCollection.find({ postedBy: req.params.email }).toArray();
            res.send(result)
        })



        app.get("/getToysByText/:text", async (req, res) => {
            const text = req.params.text;
            const result = await menuCollection
                .find({
                    $or: [
                        { Name: { $regex: text, $options: "i" } },
                        { title: { $regex: text, $options: "i" } },
                    ],
                })
                .toArray();
            res.send(result);
        });



        app.post("/reviews", async (req, res) => {
            const body = req.body;
            const result = await reviewCollection.insertOne(body)
            console.log(body)
            res.send(result)
        });


        app.get('/reviews', async (req, res) => {
            const result = await reviewCollection.find().toArray();
            res.send(result);
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('boss is sitting')
})

app.listen(port, () => {
    console.log(`College service sitting on  ${port}`);
})