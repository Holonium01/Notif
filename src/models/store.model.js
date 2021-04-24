import mongoose from 'mongoose';

export const storeSchema = new mongoose.Schema({
    name: {
        type: String
      },
    email: {
      type: String
    },
    category: {
        type: String
      },
    verified: {
      type: Boolean
    }
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'last_updated' }
  })
