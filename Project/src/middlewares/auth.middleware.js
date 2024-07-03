import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { apiErrors } from "../utils/apiErrors.js";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.AccessToken ||
      req.header("Authorization").replace("Bearer", "").trim();

    if (!token) {
      throw new apiErrors(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_WEB_TOKEN);
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) throw new apiErrors(401, "Invalid Access Token");

    req.user = user;

    next();
  } catch (error) {
    console.error(error.message);
  }
});
