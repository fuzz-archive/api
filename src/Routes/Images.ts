import { Request, Response, Router } from 'express'
import mongoose from 'mongoose'
import { authenticateToken } from '../Middleware/JWT'
import MemeSchema from '../Models/Meme'
import RandomImageSchema from '../Models/RandomImage'
import { Fetch as FetchSubreddit } from '../Util/Reddit'

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
  console.log('Connected to MongoDB!')
}).catch((err) => {
  console.log('Failed to connect to MongoDB...')
  console.error(err)
})

const router = Router()
  .get('/api/images/reddit/:subreddit', authenticateToken, async (req: Request, res: Response) => {
    const subreddit = req.params.subreddit
    const subdata = await FetchSubreddit(subreddit)
    res.status(200).send(subdata)
  })
  .get('/api/images/memes', authenticateToken, async (_req: Request, res: Response) => {
    const count = await MemeSchema.countDocuments()
    const random = Math.floor(Math.random() * count)

    const found = await MemeSchema.findOne().skip(random)
    res.status(200).send(found)
  })
  .get('/api/images/random', authenticateToken, async (_req: Request, res: Response) => {
    const count = await RandomImageSchema.countDocuments()
    const random = Math.floor(Math.random() * count)

    const found = await RandomImageSchema.findOne().skip(random)
    res.status(200).send(found)
  })
  .delete('/api/images/memes/:id', authenticateToken, async (req: Request, res: Response) => {
    const id = req.params.id
    const exist = await MemeSchema.findOne({ _id: id })

    if (exist) {
      await MemeSchema.deleteOne({ _id: id })
      res.status(200).send({ code: 200, message: '^w^ Deleted successfully', error: false })
    }
  })
  .delete('/api/images/random/:id', authenticateToken, async (req: Request, res: Response) => {
    const id = req.params.id
    const exist = await RandomImageSchema.findOne({ _id: id })

    if (exist) {
      await RandomImageSchema.deleteOne({ _id: id })
      res.status(200).send({ code: 200, message: '^w^ Deleted successfully', error: false })
    }
  })
  .post('/api/images/memes', authenticateToken, async (req: Request, res: Response) => {
    const body = await req.body
    if (!body) {
      res.status(400)
      return res.send({ code: 400, message: 'UwU Bad Request', error: false })
    }
    if (body.url && typeof body.url === 'string') {
      const count = await MemeSchema.countDocuments()
      const Image = await new MemeSchema({ id: count + 1, url: body.url }).save()
      return res.status(200).send({ id: Image.id, url: body.url })
    }
    return res.status(400).send({ code: 400, message: 'UwU Bad Request', error: false })
  })
  .post('/api/images/random', authenticateToken, async (req: Request, res: Response) => {
    const body = await req.body
    if (!body) {
      res.status(400)
      return res.send({ code: 400, message: 'UwU Bad Request [No body provided]', error: false })
    }
    if (body.url && typeof body.url === 'string') {
      const count = await RandomImageSchema.countDocuments()
      const Image = await new RandomImageSchema({ id: count + 1, url: body.url }).save()
      return res.status(200).send({ id: Image.id, url: body.url })
    }
    res.status(400)
    return res.send({ code: 400, message: 'UwU Bad Request', error: false })
  })

export = router
