const { createClient } = require('redis')
const redisurl = 'redis://localhost:6379'

const redisclient = createClient({ url: redisurl })

const connectRedis = async () => {
  try {
    await redisclient.connect()
    console.log('connected To Redis')
    console.log('Ping', await redisclient.ping())
  } catch (err) {
    console.log('Error connecting to Redis:', err)
  }
}

connectRedis()

module.exports = redisclient