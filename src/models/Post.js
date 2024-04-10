import { Schema, model } from 'mongoose'
import postResponseSchema from '../schemas/postResponseSchema.js'

const postSchema = new Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  tags: {
    type: [String]
  },
  category: {
    type: String,
    required: true,
    enum: ['UNIVERSITY', 'HIGH_SCHOOL', 'AUTODIDACT']
  },
  responses: {
    type: [postResponseSchema]
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  }
}, { timestamps: true, versionKey: false })

const Post = model('post', postSchema)

export default Post
