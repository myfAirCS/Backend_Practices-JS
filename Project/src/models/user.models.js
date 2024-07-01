import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    avatar: {
      type: String, // Cloudinary URL
      required: true,
    },
    coverImage: {
      type: String, // Cloudinary URL
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  else {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = async function () {
  return (
    await jwt.sign({
      id: this._id,
      fullName: this.fullName,
      avatar: this.avatar,
    }),
    process.env.ACCESS_WEB_TOKEN,
    {
      expiresIn: process.env.ACCESS_WEB_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign(
    {
      id: this.id,
    },
    process.env.REFRESH_WEB_TOKEN,
    {
      expiresIn: process.env.REFRESH_WEB_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
