import mongoose, { Schema } from "mongoose";

const AssetGroupSchema = new Schema(
  {
    title: String,
    description: String,
    tenantId: String,
  },
  {
    timestamps: true,
  }
);

const AssetGroup = mongoose.models.AssetGroup || mongoose.model("AssetGroup", AssetGroupSchema);

export default AssetGroup;
