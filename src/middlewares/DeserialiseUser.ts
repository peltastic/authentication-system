import { get } from "lodash";
import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwtUtils";
import sessionService from "../services/sessionService";

const authorization = async (req: Request, res: Response, next: NextFunction) => {
	const accessToken = get(req, "headers.x-access-token");
	const refreshToken = get(req, "headers.x-refresh-token");

	if (!accessToken) {
		return next();
	}

	const { decoded, expired } = await verifyJwt(accessToken);

	if (decoded) {
		res.locals.user = decoded;

		return next();
	}

	if (expired && refreshToken) {
       
		const newAccessToken = await sessionService.reIssueAccessToken({ refreshToken });

		if (newAccessToken) {
			res.setHeader("x-access-tokn", newAccessToken);

			const { decoded } = await verifyJwt(newAccessToken);
			res.locals.user = decoded;
            
            return next();
		}

        return next();
	}

	return next();
};

export default authorization;
