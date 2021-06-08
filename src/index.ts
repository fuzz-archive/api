import Express from "express"
import { Database } from "aloedb-node"
import { authenticateToken } from "./JWT"
import ImageModel from "./Models/Image"
import mongoose from "mongoose"
import dotenv from "dotenv"

interface Schema {
    id: number
    data: any
}

interface MongoSchema {
    _id: number
    data: object
}

const app = Express()
dotenv.config()

if (!process.env.MONGO_URI) {
    console.error("No MONGO_URI provided in .env")
}

const owo = new Database<Schema>("./data/OwO.json");

if (!process.env.JWT_SECRET) {
    console.log("No JWT_SECRET provided in .env")
}

app.listen(process.env.PORT || 3000, () => {
    console.log(`Running on port ${process.env.PORT}!`)
})

mongoose.connect(process.env.MONGO_URI.toString(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log("Connected to MongoDB!")
}).catch((err) => {
    console.log("Failed to connect to MongoDB...")
    console.error(err)
});

app.use(Express.json())

app.use(Express.static('public'))

app.get('/', (_req, res) => {
    res.sendFile(__dirname + '/public/home.html')
})

app.get('/api/images', authenticateToken, async (_req, res) => {
    const count = await ImageModel.countDocuments()
    const random = Math.floor(Math.random() * count)

    const found = await ImageModel.findOne().skip(random)
    res.send(found)
})

app.post('/api/images', authenticateToken, async (req, res) => {
    const body = await req.body;
    if (!body) {
        res.status(400)
        res.send({ code: 400, message: 'UwU Bad Request', error: false })
        return
    }
    if (!body._id) {
        res.status(400)
        res.send({ code: 400, message: 'UwU Bad Request', error: false })
        return
    }
    if (body.url && typeof body.url === 'string') {
        const count  =  await ImageModel.countDocuments()
        const Image = new ImageModel({ _id: count + 1, url: body.url })
        Image.save()
        res.status(200)
        res.send({ _id: body.id, url: body.url })
        return
    }
    res.status(400)
    res.send({ code: 400, message: 'UwU Bad Request', error: false })
    return
})

app.get('/api/owo', authenticateToken, async (_req, res) => {
    res.send(await owo.findMany())
})

app.post('/api/owo', authenticateToken, async (req, res) => {
    const body = await req.body;
    if (!body) {
        res.status(400)
        res.send({ code: 400, message: 'UwU Bad Request', error: false })
        return
    }
    if (!body.id) {
        res.status(400)
        res.send({ code: 400, message: 'UwU Bad Request', error: false })
        return
    }
    if (!body.data) {
        res.status(400)
        res.send({ code: 400, message: 'UwU Bad Request', error: false })
        return
    }
    if (body.id && typeof body.id == "number") {
    owo.insertOne({ id: body.id, data: body.data })
    res.status(200)
    res.send({ id: body.id, data: body.data })
    return
    }
    res.status(400)
    res.send({ code: 400, message: 'UwU Bad Request', error: false })
    return
})

app.get('/api/owo/:id', authenticateToken, async (req, res) => {
    const id = req.params.id
    const data = await owo.findOne({ id: id })

    res.send(data)
})

app.delete("/api/owo/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;
    const exist = await owo.findOne({ id: id })

    if (exist) {
        await owo.deleteOne({ id: id })
        res.status(200).send({ code: 200, message: "^w^ Deleted successfully", error: false})
    }
})

app.use(function(_req, res) {
    res.status(404).send({ code: 404, message: "UwU Not found", error: false })
});

app.use(function(_error, _req, res, _next) {
    res.status(500).send({ code: 500, message: "QwQ Internal Server Error", error: true })
});