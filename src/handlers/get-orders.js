
import Queue from 'bee-queue'

import {OrderModel} from '../models/index.js'
import {logError} from '../helpers/index.js'

const emailQueue = new Queue('email')


export const getOrders = async(payload) => {
    try {

        pushOrdersWithinHourToQueue(payload)

    } catch (error) {

        logError('getOrders', error, payload)

    }
}

async function pushOrdersWithinHourToQueue(payload) {
    const {hour} = payload
    const currentTime = new Date()
    const startTime = addMinutes(currentTime, hour)
    const endTimeHour = hour + getHourEquivalent(hour)
    const endTime = addMinutes(currentTime, endTimeHour)

    //get lenght of total document so we can batch
    const totalDocumentLength = await OrderModel.countDocuments({pickup_time: {$gte:startTime, $lte: endTime}, fulfilled: false, paid: true}).exec()

    if(totalDocumentLength) {
        getOrdersFromDB(totalDocumentLength, 5000) //change to 5000
    }
}

function addMinutes(date, hour) {

    return new Date(date.getTime() + hour * 60 * 60000); //get the hour in minutes and add to current minute

}

function getHourEquivalent(hour) {

    return hour === 1 ? 0.0833333333 : 0.483333333 //hour equivalence of 5 and 29 minutes
}

function addOrdersToQueue(orders) {

    //split orders into array of 200s and push to queue
    while (orders.length) {

        const data = orders.splice(0, 500)

        return emailQueue.createJob(data).save()

    }

}
async function getOrdersFromDB(totalDocumentLength, limit) {
    //get paid orders that are unfufilled and falls withing time range

    const times = Math.ceil(totalDocumentLength / limit) //query the DB with limit of 5000 documents at a time

    for (let i = 0; i < times; i++) {
        let orders
        let lastId
        if(i === 0){ //leveraging sequential objectId to pull orders in a paginated format
            orders = await OrderModel.find({pickup_time: {$gte:startTime, $lte: endTime}, fulfilled: false, paid: true}, {limit}).populate('user', '-_id name email').populate('store', '-_id name').lean().exec()
            if(orders) lastId = orders[orders.length - 1]._id
        } else {
            if(lastId) orders = await OrderModel.find({_id: { $gt: lastId}, pickup_time: {$gte:startTime, $lte: endTime}, fulfilled: false, paid: true},{limit}).populate('user', '-_id name email').populate('store', '-_id name').lean().exec()
            if(orders) lastId = orders[orders.length - 1]._id
        }
        if(orders) addOrdersToQueue(orders)
    }
}

//do my find, use last objectId of the last to get next and limit it then continue