import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { apiErrors } from "../utils/apiErrors.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/fileUpload(Cloudinary).utils.js";
import { apiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

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
  ) {
    throw new apiErrors(400, "All Fields are Required");
  }

  const existedUser = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });

  if (existedUser) throw new apiErrors(405, "User Exists Already");

  const avatarLocalPath = req.files.avatar[0].path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new apiErrors(400, "Please Upload an Avatar");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  let coverPic;
  if (coverImageLocalPath) {
    coverPic = await uploadOnCloudinary(coverImageLocalPath);
  }

  const user = await User.create({
    fullName,
    email,
    password,
    username,
    avatar: avatar.url,
    coverImage: coverPic?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiErrors(500, "Failed To Register User");
  }

  //end

  return res
    .status(200)
    .json(new apiResponse("User Created Successfully", 200, createdUser));
});

//LogInMethod
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(email || username))
    throw new apiErrors(400, "Email or Username is required ");

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) throw new apiErrors(404, "User doesn't exist");

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) throw new apiErrors(401, "Password Incorrect");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("AccessToken", accessToken, options)
    .cookie("RefreshToken", refreshToken, options);

  //end
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("AccessToken", options)
    .clearCookie("RefreshToken", options)
    .json(new apiResponse("User Logged Out", 200, {}));
});

export { registerUser, loginUser, logoutUser };
