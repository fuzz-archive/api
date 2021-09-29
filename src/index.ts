import compression from 'compression'
import dotenv from 'dotenv'
import Express, { NextFunction, Request, Response } from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import hpp from 'hpp'
import ImageRoutes from './Routes/Images'
import TestRoutes from './Routes/Tests'

const app = Express()
dotenv.config()

if (!process.env.MONGO_URI) {
  console.error('No MONGO_URI provided in .env')
}

if (!process.env.JWT_SECRET) {
  console.log('No JWT_SECRET provided in .env')
}

app.use(Express.json())

// Preformance
app.use(compression())

app.get('/', (_req: Request, res: Response) => {
  res.status(200).send({ code: 200, message: 'hello!', error: false })
})

// Routes / Endpoints
app.use(ImageRoutes)
app.use(TestRoutes)

// Security
app.disable('x-powered-by')
app.use(hpp())
app.use(mongoSanitize())
app.use(helmet())

// Extra Functions
app.use(function (_req: Request, res: Response) {
  res.status(404).send({ code: 404, message: 'UwU Not found', error: false })
})

app.use(function (_error: Error, _req: Request, res: Response, _next: NextFunction) {
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
