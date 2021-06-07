import Express from "express"
import { Database } from "aloedb-node"
import { authenticateToken } from "./JWT"
import dotenv from "dotenv"

interface OwO {
    id: string
}

const app = Express()
dotenv.config()

const owo = new Database<OwO>("./data/test.json");

app.listen(3000, ()=>{
    console.log('Running on port 3000')
})  

app.use(Express.json())

app.get('/api/protected', authenticateToken, (req, res) => {
    res.send('It works!')
})

app.get('/api/owo', async (req, res) => {
    res.send(await owo.findMany())
})

app.post('/api/owo', async (req, res) => {
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
    owo.insertOne(body)
    res.status(200)
    res.send(body)
})

app.get('/api/owo/:id', async (req, res) => {
    const id = req.params.id
    const data = await owo.findOne({ id: id })

    res.send(data)
})

app.delete("/api/owo/:id", async (req, res) => {
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