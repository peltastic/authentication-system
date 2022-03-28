import { get } from "lodash";
import { FilterQuery, UpdateQuery } from "mongoose";
import config from "config";
import sessionsModel, { SessionDocument } from "../models/sessionsModel";
import { signJwt, verifyJwt } from "../utils/jwtUtils";
import userServices from "./authService";
import { InvalidError } from "../../lib/appErrors";
import UserModel from "../models/UserModel";
import { decode } from "punycode";

class Session {
	async createSession(userId: string, userAgent: string) {
		const session = await sessionsModel.create({ user: userId, userAgent });

		return session;
	}

	async findSessions(query: FilterQuery<SessionDocument>) {
		return await sessionsModel.find(query).lean();
	}

	async deleteSession(
		query: FilterQuery<SessionDocument>,
		update: UpdateQuery<SessionDocument>,
	) {
		let ses = await sessionsModel.findOne(query);
		console.log(query)
		return await sessionsModel.deleteOne(query);
	}

	async reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
		const { decoded } = await verifyJwt(refreshToken);

		if (!decoded || !get(decoded, "session")) return false;

		const session = await sessionsModel.findById(get(decoded, "session"));

		if (!session || !session.valid) return false;

		const user = await userServices.findUser({ _id: session.user });

		if (!user) return false;

		//  create an acess token
		const accessToken = signJwt(
			{ ...user, session: session._id },
			{ expiresIn: config.get("accessTokenLT") },
		);

		return accessToken;
	}

	async validateToken(token: string) {
		const { decoded, expired } = await verifyJwt(token);

		if (expired || !decoded)
			throw new InvalidError("User does not exist or invalid token");

		// find user and verify user
		const id = get(decoded, "_id")
		const user = await UserModel.findById(id);
	
		user!.isVerified = true;
		await user!.save()

		return user
	}
}

export default new Session();
