import { Schema, model } from 'mongoose';

const waterSchema = new Schema(
  {
    date: { type: String, required: true },
    volume: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const WaterCollection = model('water', waterSchema);
