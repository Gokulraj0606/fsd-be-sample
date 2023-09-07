import express from "express"
import { MongoClient } from "mongodb"
import cors from "cors"
import * as dotenv from "dotenv"
dotenv.config()

const app = express()
app.use(cors())
const PORT = 5000
// console.log(process.env.MONGO_URL)

// Mongodb connection
const MONGO_URL = process.env.MONGO_URL
async function createConnection() {
    const client = new MongoClient(MONGO_URL)
    await client.connect()
    console.log("Mongodb is connected")
    return client
}
const client = await createConnection()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World')
})

//db.(dbname).collection(name).find()
app.get('/products', async (req, res) => {
    const product = await client.db("fsd-k-demo").collection("products").find().toArray()
    res.send(product)
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params
    const product = await client.db("fsd-k-demo").collection("products").findOne({ id: id })
    res.send(product)
})

//delete same like get method by id
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params
    const product = await client.db("fsd-k-demo").collection("products").deleteOne({ id: id })
    res.send(product)
})

// post method
app.post('/products', async (req, res) => {
    const newProduct = req.body
    const result = await client.db("fsd-k-demo").collection("products").insertMany(newProduct)
    res.send(result)
})

// put method -- is combain of get medhod by id & post method
//update method we use set operators
app.put('/products/:id', async (req, res) => {
    const { id } = req.params
    const updatedProduct = req.body
    const result = await client.db("fsd-k-demo").collection("products").updateOne({ id: id }, { $set: updatedProduct })
    res.send(result)
})

app.listen(PORT, () => { console.log("app is listening in", PORT) })  