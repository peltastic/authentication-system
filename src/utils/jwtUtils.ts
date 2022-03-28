// we need to create functions that will sign and verify our jwt
import jwt from "jsonwebtoken";
import config from "config";

const privateKey = config.get<string>("privateKey");
const publicKey = config.get<string>("publicKey");

export async function signJwt(
	object: Object,
	options?: jwt.SignOptions | undefined,
) {
	// sign with a private key
	return jwt.sign(object, privateKey, {
		...(options && options),
		algorithm: "RS256",
	});
}

export async function verifyJwt(token: string) {
	// verify with a public key
	try {
		const decoded = jwt.verify(token, publicKey);
		return {
			valid: true,
			expired: false,
			decoded,
		};
	} catch (e: any) {
		console.log(e)
		return {
			valid: false,
			expired: e.message === "jwt expired",
			decoded: null,
		};
	}
}
