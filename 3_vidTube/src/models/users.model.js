import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary URL
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      // an objectId
      {
        type: Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
    password: {
      type: String,
      required: [true, 'password is required'], // field is empty then throw this error msg
    },
    refreshTokens: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// model.pre(Event, function())
// Caution: In function, do not use Arrow Functions becasue it requires a lot of 'Context' stuff
// next parameter is always required since after req, res, we pass on to the next hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  // jwt.sign( '{Payload: Data}', 'Secret', 'Expiry')
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
  );
};

userSchema.methods.generateRefreshToken = function () {
  // jwt.sign( '{Payload: Data}', 'Secret', 'Expiry')
  return jwt.sign(
    {
      _id: this._id,
    }, // only have this to update the value
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
  );
};

export const User = mongoose.model('User', userSchema);
