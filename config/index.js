//This file contains the configurations in the .env file 

export const config = {
    PORT: process.env.PORT,
    DB: {
        URL: process.env.MONGO_URI,
        NAME: process.env.MONGO_DB_NAME,
        options: {useNewUrlParser:true, useUnifiedTopology: true}
    },
    EMAIL: {
        USERNAME:process.env.EMAIL_USERNAME,
        PASSWORD:process.env.EMAIL_PASSWORD,
        PROVIDER:process.env.EMAIL_PROVIDER
    },
    REDIS: {
        HOST:process.env.REDIS_HOST,
        PORT:process.env.REDIS_PORT
    },
    QUEUE_OPTIONS : {
        removeOnSuccess: true,
        redis: {
            host:process.env.REDIS_HOST,
            port:process.env.REDIS_PORT
        }
    }
}