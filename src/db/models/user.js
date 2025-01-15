import { Schema, model } from 'mongoose';

const usersSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: false,
      enum: ['woman', 'man'],
      default: 'woman',
    },
    weight: {
      type: Number,
      required: false,
      default: 0,
    },
    activeTime: {
      type: Number,
      required: false,
      default: 0,
    },
    dailyNorm: {
      type: Number,
      required: false,
      default: 1500,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

usersSchema.pre('save', function (next) {
  if (!this.name) {
    this.name = this.email.split('@')[0];
  }
  next();
});

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', usersSchema);
