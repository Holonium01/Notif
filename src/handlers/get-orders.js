
import {OrderModel} from '../models/index.js'
import {logError, getQueue} from '../helpers/index.js'

const emailQueue = getQueue('email')


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
    const startTime = addMinutes(currentTime, hour) //convert the hour to miutes and add to
    const endTimeHour = hour + getHourEquivalent(hour) //add extra 5 or 29 minutes to the hour.. hour can be 1 or 24
    const endTime = addMinutes(currentTime, endTimeHour) //convert hour to minute

    //get lenght of total document so we can batch and not hit db at once if orders are much
    const totalDocumentLength = await OrderModel.countDocuments({pickup_time: {$gte:startTime, $lte: endTime}, fulfilled: false, paid: true}).exec()

    if(totalDocumentLength) {
        getOrdersFromDB(totalDocumentLength, 5000, startTime, endTime)
    }
}

function addMinutes(date, hour) {

    return new Date(date.getTime() + hour * 60 * 60000); //get the hour in minutes and add to current minute

}

function getHourEquivalent(hour) {

    return hour === 1 ? 0.0833333333 : 0.483333333 //hour equivalence of 5 and 29 minutes
}

function addOrdersToQueue(orders) {

    //split orders into array of 100s and push to queue
    while (orders.length) {

        const data = orders.splice(0, 100)

        return emailQueue.createJob(data).save()

    }

}
async function getOrdersFromDB(totalDocumentLength, limit, startTime, endTime) {

    const times = Math.ceil(totalDocumentLength / limit) //query the DB with limit of 5000 documents at a time
    let lastId
    for (let i = 0; i < times; i++) {
        let orders
        if(i === 0){ //leveraging sequential objectId to pull orders in a paginated format instead of using skip() which is not optimal
            orders = await OrderModel.find({pickup_time: {$gte:startTime, $lte: endTime}, fulfilled: false, paid: true}, {limit}).populate('user', '-_id name email').populate('store', '-_id name').lean().exec()
            if(orders.length) lastId = orders[orders.length - 1]._id
        } else {
            if(lastId) orders = await OrderModel.find({_id: { $gt: lastId}, pickup_time: {$gte:startTime, $lte: endTime}, fulfilled: false, paid: true},{limit}).populate('user', '-_id name email').populate('store', '-_id name').lean().exec()
            if(orders.length) lastId = orders[orders.length - 1]._id
        }
        if(orders) addOrdersToQueue(orders)
    }
}
