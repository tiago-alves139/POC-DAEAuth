import mongoose, { Schema } from "mongoose";

const tenantSchema = new Schema(
  {
    _id: String,
    title: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

const Tenant = mongoose.models.Tenant || mongoose.model("Tenant", tenantSchema);

export default Tenant;
