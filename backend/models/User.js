const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { hashPassword, comparePassword } = require('../services/password');

// User Blueprint
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);


// Hash before store (pre save)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await hashPassword(this.password);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
