import Express, { Request, Response, NextFunction } from "express"
import { Database } from "aloedb-node"
import { authenticateToken } from "./JWT"
import MemeModel from "./Models/Meme"
import mongoose from "mongoose"
import dotenv from "dotenv"
import helmet from "helmet"
import mongoSanitize from "express-mongo-sanitize"

interface Schema {
    id: number
    data: any
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

app.get('/', (_req: Request, res: Response) => {
    res.status(200).send({ code: 200, message: 'hello!', error: false})
})

app.get('/api/images/memes', authenticateToken, async (_req: Request, res: Response) => {
    const count = await MemeModel.countDocuments()
    const random = Math.floor(Math.random() * count)

    const found = await MemeModel.findOne().skip(random)
    res.send(found)
})

app.delete("/api/images/memes/:id", authenticateToken, async (req: Request, res: Response) => {
    const id = req.params.id;
    const exist = await MemeModel.findOne({ _id: id })

    if (exist) {
        await MemeModel.deleteOne({ _id: id })
        res.status(200).send({ code: 200, message: "^w^ Deleted successfully", error: false})
    }
})

app.post('/api/images/memes', authenticateToken, async (req: Request, res: Response) => {
    const body = await req.body;
    if (!body) {
        res.status(400)
        res.send({ code: 400, message: 'UwU Bad Request', error: false })
        return
    }
    if (body.url && typeof body.url === 'string') {
        const count  =  await MemeModel.countDocuments()
        const Image = new MemeModel({ _id: count + 1, url: body.url })
        Image.save()
        res.status(200)
        res.send({ _id: count + 1, url: body.url })
        return
    }
    res.status(400)
    res.send({ code: 400, message: 'UwU Bad Request', error: false })
    return
})

app.get('/api/owo', authenticateToken, async (_req: Request, res: Response) => {
    res.send(await owo.findMany())
})

app.post('/api/owo', authenticateToken, async (req: Request, res: Response) => {
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

app.get('/api/owo/:id', authenticateToken, async (req: Request, res: Response) => {
    const id = req.params.id
    const data = await owo.findOne({ id: id })

    res.send(data)
})

app.delete("/api/owo/:id", authenticateToken, async (req: Request, res: Response) => {
    const id = req.params.id;
    const exist = await owo.findOne({ id: id })

    if (exist) {
        await owo.deleteOne({ id: id })
        res.status(200).send({ code: 200, message: "^w^ Deleted successfully", error: false})
    }
})

// Protections
app.use(mongoSanitize())
app.use(helmet())

app.use(function(_req: Request, res: Response) {
    res.status(404).send({ code: 404, message: "UwU Not found", error: false })
});

app.use(function(_error, _req: Request, res: Response, _next: NextFunction) {
    res.status(500).send({ code: 500, message: "QwQ Internal Server Error", error: true })
});
