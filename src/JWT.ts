import JWT from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export function generateAccessToken(username: string) {
    return JWT.sign(username, process.env.JWT_SECRET, { expiresIn: '1800s' });
}

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) {
        return res.sendStatus(401).send('UwU Forbidden')
    }
  
    JWT.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
  
    if (err) {
        return res.sendStatus(403).send('UwU Forbidden')
    }
  
      req.user = user
  
      next()
    })
}