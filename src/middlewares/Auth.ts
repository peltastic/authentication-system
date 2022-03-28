import { NextFunction, Request, Response } from "express";
import { UnAuthorizedError } from "../../lib/appErrors";
import UserModel from "../models/UserModel";

export const authentication = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const user = res.locals.user;
	if (!user) throw new UnAuthorizedError("User is unauthorized");

	return next();
};

export const authFunctions = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const user = await UserModel.findById(res.locals.user._id);

	res.locals.user = user;

	return next();
};
