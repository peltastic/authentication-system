import { get, StringIterator } from "lodash";
import { DocumentDefinition, FilterQuery } from "mongoose";
import { decode } from "punycode";
import {
	InternalServerError,
	InvalidError,
	NotFoundError,
	UnAuthorizedError,
} from "../../lib/appErrors";
import UserModel, { UserDocument } from "../models/UserModel";
import { verifyJwt } from "../utils/jwtUtils";

class User {
	async createUser(
		input: DocumentDefinition<
			Omit<
				UserDocument,
				| "updatedAt"
				| "createdAt"
				| "comparePassword"
				| "companyId"
				| "isVerified"
			>
		>,
	) {
		try {
			return await UserModel.create(input);
		} catch (e: any) {
			throw new InternalServerError(e.message);
		}
	}

	async validatePassword({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) {
		// we need to first find if the user exist;
		const user = await UserModel.findOne({ email });

		if (!user) throw new InvalidError("Invalid User");

		const isValid = await user.comparePassword(password);
		if (!isValid) throw new InvalidError("Invalid User ");

		if(!user.isVerified) throw new UnAuthorizedError("User is not verified.")

		return user.toJSON();
	}

	async findUser(query: FilterQuery<UserDocument>) {
		return await UserModel.findOne(query).lean();
	}

	async validateEmail(query: object) {
		const user = await UserModel.findOne(query);
		if (!user) throw new NotFoundError("user with this email does not exist");

		return user;
	}

	async resetPassword(token: string, password: string) {
		// decode the token
		const { decoded, expired } = await verifyJwt(token);
		if (expired || !decoded) throw new InvalidError("Invalid user");

		const findUser = await UserModel.findById(get(decoded, "_id"));
		if (!findUser) throw new NotFoundError("User is Invalid");

		findUser.password = password;
		await findUser.save();

		return findUser;
	}
}

export default new User();
