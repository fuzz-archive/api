/**
 * Please be aware if other users can access this file they can generate their own access tokens
 *
 * These tokens expire in 2 hours. To change this go to the JWT.ts file and change 7200s
 * s = seconds
 **/

import { generateAccessToken } from './Middleware/JWT'

console.log(generateAccessToken({ username: 'Username here' }))
