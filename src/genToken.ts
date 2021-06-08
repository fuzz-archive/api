/**
 * Please be aware if other users can access this file they can generate their own access tokens
 * 
 * These tokens expire in 24 hours. To change this go to the JWT.ts file and change 24h
 * h = hours
 * s = seconds
 **/

import { generateAccessToken } from './JWT'

console.log(generateAccessToken('Username here! or whatever'))