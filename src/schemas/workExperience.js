import { Schema } from 'mongoose'

const workExperience = new Schema(
  {
    institution: {
      type: String,
      default: null,
      trim: true
    },
    labor: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    years: {
      type: Number,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export default workExperience
