import moment from 'moment'
import Redis from 'ioredis';
import Queue from 'bee-queue';


//util functions
const time = moment().unix()
const redis = new Redis({host: process.env.REDIS_HOST, port: process.env.REDIS_PORT})

export const logError = (tag, error, info) => {

    console.log({ 
        status: 'failed',
        location: tag, 
        errorName: error.name, 
        errorMessage: error.message,
        errorCode: `PDE-${time}`,
        stackTrace: error.stack || 'unavailable',
        info,
        when: new Date()
    });
}

export const logSuccess = (tag, message) => {

    saveToStorage({data:message, key: tag})

    console.log({ 
        status: 'success',
        location: tag, 
        succesMessage: message,
        succesCode: `PDS-${time}`,
        when: new Date()
    });

}

export const saveToStorage = async (payload) => {
    const {data, key} = payload

    const content = await getFromRedis(key) || []
    content.push(data)
    saveToRedis(key, content)

}

const saveToRedis = (identifier, value) => {

    const val = typeof value === 'string' ? value : JSON.stringify(value)
    const key = typeof identifier === 'string' ? identifier : JSON.stringify(identifier)
    redis.set(key, val)

}

const getFromRedis = async (identifier) => {

    const key = typeof identifier === 'string' ? identifier : JSON.stringify(identifier)

    return new Promise((resolve, reject) => {

        redis.get(key, function(err, res) {
           if(err) {
               reject(err)
           } else {
               try { //using trycatch here because json.parse will throw an error if cant parse for regualar strings
                resolve(JSON.parse(res))
               } catch (error) {
                 resolve(res)  
               }
           }
       })

    })
}

export const getQueue = (tag) => {
    const options = {
        removeOnSuccess: true,
        redis: {
            host:process.env.REDIS_HOST,
            port:process.env.REDIS_PORT
        }
      }
      
      const emailQueue = new Queue(tag, options)
      return emailQueue
}