import { Request, Response } from "express";
import config from "config";
import logger from "../utils/logger";
import appResponse from "../../lib/appResponse";
import { emailVerification, passwordValidationMail } from "../utils/mailer";

import {
	createUserInput,
	emailInput,
	resetPasswordInput,
	tokenString,
} from "../schemaValidation/user.ValidationSchema";
import { signJwt } from "../utils/jwtUtils";
import sessionService from "../services/sessionService";
import authService from "../services/authService";

class User {
	async createUserHandler(
		req: Request<{}, {}, createUserInput["body"]>,
		res: Response,
	) {
		try {
			const createdUser = await authService.createUser(req.body);

			const token = await signJwt(
				{ ...createdUser.toJSON() },
				{
					expiresIn: config.get("accessTokenLT"),
				},
			);

			// send email with token
			await emailVerification(createdUser.email, "Verfiy Email", token);

			res.send(appResponse("successfully registered user", createdUser));
		} catch (e: any) {
			logger.error(e);
			res.status(409).send(appResponse(e.message));
		}
	}

	async validateTokenHandler(
		req: Request<{}, {}, {}, tokenString["query"]>,
		res: Response,
	) {
		const { token } = req.query;
		const validateSuccess = await sessionService.validateToken(token);
		res.send(appResponse("validated User successfully", validateSuccess));
	}
	// forgotPassInput
	async forgotPasswordHandler(
		req: Request<{}, {}, emailInput["body"]>,
		res: Response,
	) {
		const { email } = req.body;
		const validateEmail = await authService.validateEmail({ email });

		const token = await signJwt(
			{ ...validateEmail.toJSON() },
			{
				expiresIn: config.get("accessTokenLT"),
			},
		);

		await passwordValidationMail(email, "Forgot Password", token);

		res.send(appResponse("sent password reset mail successfully"));
	}

	async resetPasswordHandler(
		req: Request<{}, {}, resetPasswordInput["body"], tokenString["query"]>,
		res: Response,
	) {
		const { token } = req.query;
		const { password } = req.body;

		// validate user and update his password
		const updatePassword = await authService.resetPassword(token, password);

		res.send(appResponse("password changed successfully", updatePassword));
	}
	async resendEmailHandler(
		req: Request<{}, {}, emailInput["body"]>,
		res: Response,
	) {
		const { email } = req.body;
		const validateEmail = await authService.validateEmail({ email });

		const token = await signJwt(
			{ ...validateEmail.toJSON() },
			{
				expiresIn: config.get("accessTokenLT"),
			},
		);

		await emailVerification(email, "Verfiy Email", token);

		res.send(appResponse("Resent email sucessfully", true));
	}
}

export default new User();
