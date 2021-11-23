import config from "config";
import { Request, Response } from "express";
import sessionService from "../services/session.service";
import userService from "../services/user.service";
import { sign } from "./../utils/jwt.utils";

class Sessions {
  async createSession(req: Request, res: Response) {
    // validate email and password
    const user = await userService.validatePassword(req.body);

    if (!user) {
      return res.status(404).send("Invalid username and Password");
    }
    // create a session
    const session = await sessionService.createSession(
      user._id.toString(),
      req.get("user-agent") || ""
    );
    // create access token
    const accessToken = await sessionService.createAccessToken({
      user,
      session,
    });
    
    // creating a refresh accessToken
    const refreshToken = sign(session, {
      expiresIn: config.get("refreshTokenTtl"),
    });

    res.send({ accessToken, refreshToken });
  }
}

export default new Sessions();
