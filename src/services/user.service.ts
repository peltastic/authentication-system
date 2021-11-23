import { omit } from "lodash";
import { DocumentDefinition } from "mongoose";
import UserModel, { userDocument } from "./../models/user.model";

class User {
  async createUser(body: DocumentDefinition<userDocument>) {
    const newUser = new UserModel(body);
    await newUser.save();

    return newUser;
  }

  async validatePassword({
    email,
    password,
  }: {
    email: userDocument["email"];
    password: string;
  }) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return false;
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
      return false;
    }

    return omit(user, "password");
  }
}

export default new User();
