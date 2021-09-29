import dotenv from 'dotenv'
import type { NextFunction, Request, Response } from 'express'
import JWT from 'jsonwebtoken'

dotenv.config()

export function generateAccessToken (username: { username: string }) {
  return JWT.sign(username, process.env.JWT_SECRET, { expiresIn: '7200s' })
}

export function authenticateToken (req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (token == null) {
    return res.sendStatus(401).send({ code: 401, message: 'UwU Forbidden', error: false })
  }

  return JWT.verify(token, process.env.JWT_SECRET, (err: any, _user: any) => {
    if (err) {
      return res.sendStatus(403).send({ code: 403, message: 'UwU Forbidden', error: false })
    }

    return next()
  })
}
