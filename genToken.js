const { generateAccessToken } = require('./dist/JWT')

console.log(generateAccessToken({ username: 'Username here! or whatever', expiresIn: '24h' }))