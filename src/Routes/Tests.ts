import { Router, Request, Response } from 'express'

const router = Router()
	.get('/api/tests/query', async (req, res) => {
		const query = req.query
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
		res.status(200).send(`Query: ${query}`)
		console.log(query)
	})

export = router
