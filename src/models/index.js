import mongoose from 'mongoose'

import {orderSchema} from './order.model.js'
import {userSchema} from './user.model.js'
import {storeSchema} from './store.model.js'


export const OrderModel = mongoose.model('orderSchema', orderSchema)
export const StoreModel = mongoose.model('storeSchema', storeSchema);
export const UserModel = mongoose.model('userSchema', userSchema);

