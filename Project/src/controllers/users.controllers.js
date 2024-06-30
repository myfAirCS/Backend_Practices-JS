import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { apiErrors } from "../utils/apiErrors.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/fileUpload(Cloudinary).utils.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // Get Data from Frontend or USer
  // Check Validation and if any field is empty
  // check Images as it is necessary
  // Check Email and Username
  // upload pic to cloudinary
  // create object for DB
  // Remove password and refresh token from Response
  // Check User Creation
  // return Response

  const { fullName, email, password, username } = req.body;

  if (
    [fullName, email, password, username].some((field) => field?.trim() === "")
  )
    throw new apiErrors(400, "All Fileds are Required");

  const existedUser = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });

  if (existedUser) throw new apiErrors(405, "User Exists Already");

  const avatarLocalPath = req.files?.avatar[0]?.path; // check if there is an image
  const coverImageLocalPath = req.files?.coverPic[0]?.path;

  if (!avatarLocalPath) {
    throw new apiErrors(400, "Please Upload an Avatar");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (coverImageLocalPath) {
    const coverPic = await uploadOnCloudinary(coverImageLocalPath);
  }

  const user = await User.create({
    fullName,
    email,
    password,
    username,
    avatar: avatar.url,
    coverImage: coverPic?.url || "", // if there is a cover image
  });

  const createdUser = await User.findById({
    _id: user._id,
  }).select("-password -refreshToken");

  if (!createdUser) {
    throw new apiErrors(500, "Failed To Register User");
  }

  return res
    .status(200)
    .json(new apiResponse("User Created Successfully", 200, createdUser));
});

export { registerUser };
