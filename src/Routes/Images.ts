import { authenticateToken } from '../Middleware/JWT'
import { Router, Request, Response } from 'express'
import mongoose from 'mongoose'
import MemeSchema from '../Models/Meme'
import RandomImageSchema from '../Models/RandomImage'
import { FetchSubreddit } from 'reddit.images'

mongoose.connect(process.env.MONGO_URI.toString(), {
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
	.get('/api/images/reddit/:subreddit', async (req, res) => {
		const data = await FetchSubreddit(req.params.subreddit)
		res.send(data)
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
			res.send({ code: 400, message: 'UwU Bad Request', error: false })
			return
		}
		if (body.url && typeof body.url === 'string') {
			const count = await MemeSchema.countDocuments()
			const Image = new MemeSchema({ _id: count + 1, url: body.url })
			Image.save()
			res.status(200)
			res.send({ _id: count + 1, url: body.url })
			return
		}
		res.status(400)
		res.send({ code: 400, message: 'UwU Bad Request', error: false })
	})
	.post('/api/images/random', authenticateToken, async (req: Request, res: Response) => {
		const body = await req.body
		if (!body) {
			res.status(400)
			res.send({ code: 400, message: 'UwU Bad Request [No body provided]', error: false })
			return
		}
		if (body.url && typeof body.url === 'string') {
			const count = await RandomImageSchema.countDocuments()
			const Image = new RandomImageSchema({ _id: count + 1, url: body.url })
			Image.save()
			res.status(200)
			res.send({ _id: count + 1, url: body.url })
			return
		}
		res.status(400)
		res.send({ code: 400, message: 'UwU Bad Request', error: false })
	})

export = router
