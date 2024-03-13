import mongoose, { Schema } from "mongoose";

const DeviceSchema = new Schema(
  {
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
