'use strict';

import { Schema, model } from 'mongoose';
import bcryptjs from 'bcryptjs';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required!'],
    },
    email: {
      type: String,
      required: [true, 'Email is required!'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
    },
    state: {
      type: Boolean,
      default: true,
    },
    google: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.pre('save', async function (next) {
  const user = this;
  // Validar q la contrasena se esta modificando
  if (!user.isModified('password')) return next();

  const hash = await bcryptjs.hash(user.password, 12);
  user.password = hash;
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  const user = this;
  return await bcryptjs.compare(password, user.password);
};

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  user.uid = user._id;
  delete user.password;
  delete user.state;
  delete user._id;

  return user;
};

export default model('User', UserSchema);
