import moment from 'moment'
import Redis from 'ioredis';

//util functions
const time = moment().unix()
const redis = new Redis({host: process.env.REDIS_HOST})

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
    saveToRedis(content)

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