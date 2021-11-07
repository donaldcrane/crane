import jwt from "jsonwebtoken";
import models from "../models";

class Authentication {
  /**
   * @param {object} req - The res body object
   * @param {object} res - The res body object
   * @param {object} next -  The function to call next
   * @returns {Function} errorResponse | next
   */
  static async authenticate(req, res, next) {
    try {
      let decoded;
      if (req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        if (parts.length === 2) {
          const scheme = parts[0];
          const credentials = parts[1];
          if (/^Bearer$/i.test(scheme)) {
            const token = credentials;
            decoded = await jwt.verify(token, process.env.JWT_KEY);
            req.user = await models.User.findById({ _id: decoded._id }).select("-password");
            if (!req.user) { return res.status(409).json({ status: 409, error: "Invalid user" }); }
            if (!req.user.verified) { return res.status(400).json({ status: 400, error: "Please kindly verify your account." }); }
            return next();
          }
        } else {
          return res.status(401).json({ status: 401, error: "Invalid authorization format" });
        }
      } else {
        return res.status(401).json({ status: 401, error: "Authorization not found" });
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ status: 401, error: "Session expired, you have to login." });
      }

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ status: 401, error: "Invalid Authorization token" });
      } throw error;
    }
  }
}

export default Authentication;
