import mongoose, { Schema } from "mongoose";

const DeviceSchema = new Schema(
  {
    _id: String,
    title: String,
    description: String,
    assetGroupId: String,
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.models.Device || mongoose.model("Device", DeviceSchema);

export default Device;
