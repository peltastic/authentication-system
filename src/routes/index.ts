import { Router } from "express";
import UserRouter from "./AuthRouter";

export = (router:Router) => {
	router.use(UserRouter());
	return router;
};