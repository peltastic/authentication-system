import { Request, Response } from "express";
import { CreateUserInput, VerifyUserInput } from "../schema/user.schema";
import { createUser, findUserById } from "../services/user.service";
import sendEmail from "../utils/mailer";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  console.log("goinggggg");
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

export async function forgotPasswordHandler(req: Request, res: Response) {
  
}