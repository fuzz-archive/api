import { Request, Response, Router } from 'express'
import { CheckObject } from '../Util/functions'

const router = Router()
  .get('/api/tests/query', (req: Request, res: Response) => {
    const query = req.query
    if (!CheckObject(query)) {
      return res.status(400).send({ code: 400, message: 'UwU Bad Request', error: false })
    }
    res.status(200).json(query)
    return console.log(query)
  })
  .get('/api/tests/gzip', (_req: Request, res: Response) => {
    const word = 'Hewwo!'
    return res.status(200).send(word.repeat(500))
  })

export = router
