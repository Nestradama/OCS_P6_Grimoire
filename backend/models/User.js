const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Salt = random noise
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
