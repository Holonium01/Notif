import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    name: {
        type: String
      },
    email: {
      type: String
    }
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'last_updated' }
  })
