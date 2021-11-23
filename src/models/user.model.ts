import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface userDocument extends mongoose.Document {
  name: string;
  password: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next): Promise<any> {
  const user = this as userDocument;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as userDocument;

  return await bcrypt
    .compare(candidatePassword, user.password)
    .catch((err) => false);
};

const User = model<userDocument>("User", userSchema);

export default User;
