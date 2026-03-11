import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    username: {
      type: String,
      requiered: true,
      unique: true,
      lowercase: true,
      trim: true, // removes whitespace from both ends of a string
      index: true, // usually we put index true on the fields we search on
    },
    email: {
      type: String,
      requiered: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      requiered: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // This URL will be a presigned URL from cloudinary
      required: true,
    },
    coverImage: {
      type: String, // This URL will be a presigned URL from cloudinary
      required: true,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash password before saving using pre-save middleware form mongoose and bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password using instance method
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate access token using instance method (jwt)
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Generate refresh token using instance method (jwt)
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model('User', userSchema);
