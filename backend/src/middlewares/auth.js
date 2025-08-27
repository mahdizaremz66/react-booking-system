import jwt from "jsonwebtoken";
import { ResponseHandler } from "../utils/responseHandler.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return ResponseHandler.tokenMissing(res);
  
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    ResponseHandler.tokenInvalid(res);
  }
};

export const authorize = (roles = []) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return ResponseHandler.unauthorized(res);
  }
  next();
}; 