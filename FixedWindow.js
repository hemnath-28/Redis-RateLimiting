

const client = require('./redis')

async function fixedWindow(req, res, next) {
  console.log('in the FixedWindow')

  if (!client || typeof client.incr !== 'function') {
    console.error('Redis client is not initialized or incr is not available')
    return res.status(500).json('Redis is not ready')
  }

  try {
    const ip = req.ip
    const currentMinute = Math.floor(Date.now() / 60000)
    const key = `limit:user:${currentMinute}:${ip}:`
    const windowLimit = 30
    const now = new Date()
    const secondsRemaining = 60 - now.getSeconds()
    const request = await client.incr(key)
    console.log('user Request:', request)

    if (request == 1) {
      await client.expire(key, secondsRemaining)
    }

    if (request > windowLimit) {
      console.log('It Crossed 30 Request Try again')
      return res.status(429).json('Try Again after SomeTime')
    }

    next()
  } catch (err) {
    console.error('In the Fixed Window Error', err)
    next()
  }
}

module.exports = fixedWindow

