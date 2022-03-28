import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import config from "config";
import { BadRequestError, InvalidError } from "../../lib/appErrors";
import { UserDocument } from "./UserModel";
import { string } from "zod";

export interface SessionDocument extends mongoose.Document {
	user: UserDocument["_id"];
	valid: boolean;
    userAgent:string;
	createdAt: Date;
	updatedAt: Date; 
}

const sessionSchema = new mongoose.Schema(
	{
		user:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
        valid:{type: Boolean, default: true},
        userAgent: {type:String}
	},
	{ timestamps: true },
);

sessionSchema.methods.toJSON = function () {
	const self = this;
	const selfObject = self.toObject();

	return selfObject;
};


export default mongoose.model<SessionDocument>("Session", sessionSchema);
