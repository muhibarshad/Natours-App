const crypto = require('crypto');
const mongoose = require('mongoose');
const Validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
    unique: true,
    validate: [Validator.isEmail, 'Please provide the valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user',
  },

  password: {
    type: String,
    required: [true, 'Please provide the password'],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your provided password'],
    //Only works for create() and save()
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: 'Both password and confirm password are not same ',
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  changedPasswordAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpiresIn: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.changedPasswordAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function () {
  this.find({ active: { $ne: false } });
});
userSchema.methods.correctPassword = async (candidatePassword, userPasswod) => {
  return await bcrypt.compare(candidatePassword, userPasswod);
};
userSchema.methods.changedPasswordVerify = function (jwtTimeStamp) {
  if (this.changedPasswordAt) {
    const changedTime = parseInt(this.changedPasswordAt.getTime() / 1000, 10);
    return jwtTimeStamp < changedTime;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpiresIn = Date.now() + 10 * 60 * 1000;
  console.log(this.passwordResetToken, resetToken);
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
