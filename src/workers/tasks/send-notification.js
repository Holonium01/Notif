
import Queue from 'bee-queue';

import EmailService from '../../notification/send-email.js'
import {getOrders} from '../../handlers/get-orders.js'
import {logError, saveToStorage} from '../../helpers/index.js'


const emailQueue = new Queue('email')
let EmailServer


async function sendMailToUsers(orders, done) {

      const requests = orders.map((order) => { 

        return EmailServer.send(order).catch(e => addBackToQueue(order, e)) 

      })

      await Promise.allSettled(requests)
        .then(()=>  done())
        .catch((error) => {
         done()
         logError('sendMailToUsers', error, {failedOrders: orders})
        })
 
  }

function addBackToQueue(order, error) {

  if(order.error) {

    logError('addBackToQueue', error)
    saveToStorage({data: {order, error}, key: 'addBackToQueue'}) // save the order if it fails after retry

  } else {

    order.error = error.response || error.message //if single order failute attac
    emailQueue.createJob([order]).save() //retry after first failure

  }

}


export const sendNotification = async (payload)  => {

    getOrders({hour: payload}) //get orders and all to quue
    EmailServer = new EmailService(payload)

}

emailQueue.process(4, function (job, done) { //dequeue and send email

   return sendMailToUsers(job.data, done)

})