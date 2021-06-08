/**
 * Please be aware if other users can access this file they can generate their own access tokens
 **/

const { generateAccessToken } = require('./dist/JWT')

console.log(generateAccessToken({ username: 'Username here! or whatever', expiresIn: '24h' }))