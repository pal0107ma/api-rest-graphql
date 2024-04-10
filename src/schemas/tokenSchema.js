import { Schema } from 'mongoose'

const tokenSchema = new Schema(
  {
    token: {
      type: String,
      default: null,
      trim: true
    },
    exp: {
      type: Number,
      default: null
    },
    iat: {
      type: Number,
      default: null
    },
    type: {
      type: String,
      enum: ['JWT', 'FORGOT-PASS', null],
      default: null
    }
  },
  {
    versionKey: false
  }
)

export default tokenSchema
