

import cron from 'node-cron'
import {sendNotification} from './tasks/send-notification.js'
import {logSuccess, logError} from '../helpers/index.js'



export const scheduleTasks =() => {

    try {

        cron.schedule('*/5 * * * *', async function() { //run every 5 minutes

            await sendNotification(1)
            logSuccess('5-min', 'One hour reminder cron successful', new Date())

          });

        cron.schedule('*/29 * * * *', async function() { //allow the crons run at different times, they'll only clash approximately once in 3 hours

          await sendNotification(24)
          logSuccess('29-min','24 hours reminder cron successful', new Date())
          
        });

    } catch (error) {

        logError('scheduleTasks', error, {time: new Date()})
        
    }
}
