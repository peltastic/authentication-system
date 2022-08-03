import { Request, Response } from "express";
import {
  CreateUserInput,
  ForgotPasswordInput,
  VerifyUserInput,
  ResetPasswordInput,
} from "../schema/user.schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../services/user.service";
import sendEmail from "../utils/mailer";
import log from "../utils/logger";
import { nanoid } from "nanoid";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);
    console.log(user.email);
    await sendEmail({
      from: "test@example.com",
      to: user.email,
      subject: "Please Verify your account",
      text: `verification code ${user.verificationCode}. id ${user._id}`,
    });
    return res.send("User successfully created");
  } catch (e: any) {
    if (e.code === 11000) {
      return res.status(409).send("Account already exists");
    }
    return res.status(500).send(e);
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  //find user by id
  const user = await findUserById(id);
  if (!user) {
    return res.send("Could Not verify User");
  }
  //check if already verified

  if (user.verified) {
    return res.send("User is already verified");
  }

  //check to see if the veridication code matches
  if (user.verificationCode === verificationCode) {
    user.verified = true;
    await user.save();
    return res.send("User successfully verified");
  }

  return res.send("Could Not Verify User");
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) {
  const message =
    "If a user with that email is registered you will receive a password reset email";

  const { email } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    log.debug(`user with email ${email} does not exists`);
    return res.send(message);
  }
  if (!user.verified) {
    return res.send("User is nor verified");
  }

  const passwordResetCode = nanoid();

  user.passwordResetCode = passwordResetCode;
  await user.save();

  await sendEmail({
    to: user.email,
    from: "pelz@gmailcom",
    subject: "Reset your Password",
    text: `Passowrd reset code: ${passwordResetCode}. Id ${user._id}`,
  });
  log.debug(`Password reset email sent to ${email}`);
  return res.send(message);
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) {
  const { id, passwordResetCode } = req.params;
  const { password } = req.body;
  const user = await findUserById(id);
  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return res.status(400).send("Could not Reset password");
  }
  user.passwordResetCode = null;
  user.password = password;
  await user.save();

  return res.send("Sucessfully updated password");
}

export async function getCurrentUserHandler(req: Request, res: Response) {
  return res.send(res.locals.user);
} 
