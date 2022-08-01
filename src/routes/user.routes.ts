import express from "express";
import {
  createUserHandler,
  verifyUserHandler,
} from "../controllers/user.controller";
import validateResource from "../middleware/validateResourse";
import { createUSerSchema, verifyUserSchema } from "../schema/user.schema";

const router = express.Router();

router.post(
  "/api/users",
  validateResource(createUSerSchema),
  createUserHandler
);

router.post(
  "/api/users/verify/:id/:verificationCode",
  validateResource(verifyUserSchema),
  verifyUserHandler
);

export default router;
