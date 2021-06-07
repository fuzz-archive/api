import Express from "express"
import { Database } from "aloedb-node"
import { authenticateToken } from "./JWT"
import dotenv from "dotenv"

interface OwO {
    id: number
    data: any
}

const app = Express()
dotenv.config()

const owo = new Database<OwO>("./data/OwO.json");

app.listen(process.env.PORT || 3000, () => {
    console.log(`Running on port ${process.env.PORT}!`)
})  

app.use(Express.json())

app.use(Express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/home.html')
})

app.get('/api/owo', authenticateToken, async (req, res) => {
    res.send(await owo.findMany())
})

app.post('/api/owo', authenticateToken, async (req, res) => {
    const body = await req.body;
    if (!body) {
        res.status(400)
        res.send('UwU Bad Request')
        return
    }
    if (!body.id) {
        res.status(400)
        res.send('UwU Bad Request')
        return
    }
    if (!body.data) {
        res.status(400)
        res.send('UwU Bad Request')
        return
    }
    if (body.id && typeof body.id == "string") {
    owo.insertOne({ id: body.id, data: body.data })
    res.status(200)
    res.send({ id: body.id, data: body.data })
    return
    }
    res.status(400)
    res.send('UwU Bad Request')
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
    }
})

app.use(function(req, res) {
    res.status(404).send('<h1>CwC Not Found</h1>')
});

app.use(function(error, req, res, next) {
    res.status(500).send('<h1>QwQ Internal Server Error</h1>')
});