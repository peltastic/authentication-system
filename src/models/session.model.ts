import { Document, Schema, model } from "mongoose";
import { userDocument } from "./user.model";

export interface SessionDocument extends Document {
  user: userDocument["_id"];
  valid: boolean;
  createdAt: Date;
  updateAt: Date;
}

const SessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  { timestamps: true }
);

const Session = model<SessionDocument>("Session", SessionSchema);

export default Session;
