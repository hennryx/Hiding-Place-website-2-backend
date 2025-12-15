import mongoose from "mongoose";
import crypto from "crypto";

const VisitorSchema = new mongoose.Schema(
    {
        ip: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
    },
    { timestamps: true }
);

VisitorSchema.statics.hashIP = function (ip) {
    return crypto.createHash("sha256").update(ip).digest("hex");
};

const Visitor = mongoose.model("Visitor", VisitorSchema);
export default Visitor;
