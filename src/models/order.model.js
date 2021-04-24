import mongoose from 'mongoose';

export const orderSchema = new mongoose.Schema({
    pickup_location: {
      type: Object
    },
    pickup_time: {
        type: Date
      },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    },
    fulfilled: {
      type: Boolean
    },
    paid: {
      type: Boolean
    },
    products: {
        type: Object
      },
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'last_updated' }
  });
