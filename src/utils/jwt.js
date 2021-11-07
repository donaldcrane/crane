import jwt from "jsonwebtoken";
import { JWT_KEY } from "../config";

export default class jwtHelper {
  static async generateToken(payload, secret = JWT_KEY) {
    const token = await jwt.sign(payload, secret, { expiresIn: "365d" });
    return token;
  }
}
