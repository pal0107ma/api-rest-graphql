import { Schema } from 'mongoose'

const skillSchema = new Schema(
  {
    skill: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: String,
      enum: ['ADVANCED', 'INTERMEDIATE', 'BASIC'],
      required: true
    },
    category: {
      type: String,
      enum: ['UNIVERSITY', 'HIGH_SCHOOL', 'AUTODIDACT'],
      required: true
    },
    topic: {
      type: String,
      default: null,
      trim: true
    }
  },
  {
    versionKey: false
  }
)

export default skillSchema
