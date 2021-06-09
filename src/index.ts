import Express, { Request, Response, NextFunction } from 'express'
import compression from 'compression'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import ImageRoutes from './Routes/Images'

const app = Express()
dotenv.config()

if (!process.env.MONGO_URI) {
	console.error('No MONGO_URI provided in .env')
}

if (!process.env.JWT_SECRET) {
	console.log('No JWT_SECRET provided in .env')
}

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

app.use(Express.json())

app.get('/', (_req: Request, res: Response) => {
	res.status(200).send({ code: 200, message: 'hello!', error: false })
})

// Preformance
app.use(compression({ level: 1 }))

// Routes / Endpoints
app.use(ImageRoutes)

// Security
app.disable('x-powered-by')
app.use(mongoSanitize())
app.use(helmet())

// Extra Functions
app.use(function (_req: Request, res: Response) {
	res.status(404).send({ code: 404, message: 'UwU Not found', error: false })
})

app.use(function (_error, _req: Request, res: Response, _next: NextFunction) {
	res.status(500).send({ code: 500, message: 'QwQ Internal Server Error', error: true })
})

// Start the Server
const server = app.listen(process.env.PORT || 80, () => {
	console.log(`Running on port ${process.env.PORT}!`)
})

process.on('SIGTERM', () => {
	console.log('SIGTERM signal received: closing HTTP server')
	server.close(() => {
		console.log('HTTP server closed')
	})
})
