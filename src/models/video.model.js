import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    videoFile: {
      type: String, // This URL will be a presigned URL from cloudinary
      required: true,
    },
    thumbnail: {
      type: String, // This URL will be a presigned URL from cloudinary
      required: true,
    },
    duration: {
      type: Number, // Duration in seconds and it also be used from cloudinary
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model('Video', videoSchema);
