import { Router } from "express";
const router = Router();
import userController from "./../controllers/user.controller";
import userSessionController from "./../controllers/session.controller";
import validate from "./../middlewares/validateRequest"
import {
  createUserSchema,
  createUserSessionSchema,
} from "./../schemas/user.schema";

export default () => {
  router.post(
    "/auth/user/create",
    validate(createUserSchema),
    userController.createUser
  );
  router.post(
    "/auth/session",
    validate(createUserSessionSchema),
    userSessionController.createSession
  );
  return router;
};
