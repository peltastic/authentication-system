import config from "config";
import { LeanDocument } from "mongoose";
import sessionModel, { SessionDocument } from "./../models/session.model";
import { userDocument } from "./../models/user.model";
import { sign } from "./../utils/jwt.utils";

class Session {
  async createSession(userId: string, userAgent: string) {
    const session = new sessionModel({ userId, userAgent });

    await session.save();

    return session;
  }

  async createAccessToken({
    user,
    session,
  }: {
    user:
      | Omit<userDocument, "password">
      | LeanDocument<Omit<userDocument, "password">>;
    session:
      | Omit<SessionDocument, "password">
      | LeanDocument<Omit<SessionDocument, "password">>;
  }) {
    const accessToken = sign(
      { user, session: session._id },
      { expiresIn: config.get("accessTokenTtl") } //15mins
    );

    return accessToken;
  }
}

export default new Session();
