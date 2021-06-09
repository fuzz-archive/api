import { Router, Request, Response } from 'express'
import { CheckObject } from '../Util/functions'

const router = Router()
	.get('/api/tests/query', async (req: Request, res: Response) => {
		const query = req.query
		if (!CheckObject(query)) {
			return res.status(400).send({ code: 400, message: 'UwU Bad Request', error: false })
		}
		res.status(200).json(query)
		console.log(query)
	})

export = router
