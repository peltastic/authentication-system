import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import appResponse from "../../lib/appResponse"
import { NotFoundError } from "../../lib/appErrors";

const validate =
	(schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params,
			});
            next();
		} catch (e: any) {
			const errors = JSON.parse(e.message)
			for (let err of errors) {
				throw new NotFoundError(err.message)
			};
			
		 }
	};

export default validate;
