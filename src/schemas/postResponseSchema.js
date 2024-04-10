import { Schema } from 'mongoose'

const postResponseSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
}, { timestamps: true, versionKey: false })

export default postResponseSchema
