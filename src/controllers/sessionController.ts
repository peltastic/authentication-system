import { Request, Response } from "express";
import config from "config";
import sessionService from "../services/sessionService";
import userServices from "../services/authService";
import appResponse from "./../../lib/appResponse";
import { signJwt } from "../utils/jwtUtils";

class Session {
	async createSessionHandler(req: Request, res: Response) {
		// we need to validate the password
		const user = await userServices.validatePassword(req.body);

		// create a session;
		const userSession = await sessionService.createSession(
			user._id,
			req.headers["user-agent"] || "",
		);

		//  create an acess token
		const accessToken = await signJwt(
			{ ...user, session: userSession._id },
			{ expiresIn: config.get("accessTokenLT") },
		);

		// create a refresh token
		const refreshToken = await signJwt(
			{ ...user, session: userSession._id },
			{ expiresIn: config.get("refreshTokenLT") },
		);

		// return access and refresh token

		res.send(appResponse("login successfully", { accessToken, refreshToken }));
	}

	async getSessionsHandler(req: Request, res: Response) {
		const userId = res.locals.user._id;
		const sessions = await sessionService.findSessions({ userId, valid: true });

		res.send(appResponse("got sessions successfully", sessions));
	}

	async deleteSessionHandler(req: Request, res: Response) {
		const sessionId = res.locals.user.session;

		const deleteSession = await sessionService.deleteSession(
			{ _id: sessionId },
			{ valid: false },
		);

		console.log(deleteSession)

		res.send(
			appResponse("deleted session", { accessToken: null, refreshToken: null }),
		);
	}
}

export default new Session();
