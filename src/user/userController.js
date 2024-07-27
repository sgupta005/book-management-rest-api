import { validationResult } from 'express-validator';
import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../utils/CustomError.js';
import { User } from './userModel.js';
import ApiResponse from '../utils/ApiResponse.js';
import uploadOnCloudinary from '../service/cloudinary.js';
import { config } from '../config.js';
import jwt from 'jsonwebtoken';

//making sure that the cookie and can only be modified by the server and not client
const options = {
  httpOnly: true,
  secure: true,
};

function generateAccessAndRefreshToken(user) {
  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();
  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
}

const getCurrentUser = asyncHandler(async (req, res, next) => {
  return res.status(200).json(new ApiResponse(200, req.user));
});

const registerUser = asyncHandler(async (req, res, next) => {
  const { email, fullname, password } = req.body;

  //validation
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res
      .status(400)
      .json(result.array().map((err) => ({ field: err.path, msg: err.msg })));
  }

  //checking if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError('User with that email already exists', 409);
  }

  //Uploading avatar file to cloudinary
  const localFilePath = req?.file?.path;
  const avatar = localFilePath ? await uploadOnCloudinary(localFilePath) : '';

  //creating user
  const user = await User.create({
    email: email.toLowerCase(),
    fullname,
    avatar,
    password,
  });

  //checking if user has been added to database successfully
  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );
  if (!createdUser) {
    throw new CustomError('User could not be added to the database.');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, 'User registered successfully'));
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError(
      'Both email and password are required to login.',
      400
    );
  }

  //checking if user with given email exists
  const user = await User.findOne({ email });
  if (!user)
    throw new CustomError('No user could be found with that email.', 400);

  //checking if password is correc
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect)
    throw new CustomError('Please enter correct password', 400);

  //creating refresh and access token and adding them to user object
  const { accessToken, refreshToken } = generateAccessAndRefreshToken(user);

  const userDataToReturn = await User.find({ email }).select(
    '-password -refreshToken'
  );

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(200, userDataToReturn, 'User logged in successfully.')
    );
});

const logoutUser = asyncHandler(async (req, res, next) => {
  const { user } = req;
  await User.findByIdAndUpdate(
    user._id,
    { refreshToken: undefined },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'User logged out successfully.'));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  //getting refresh token from client
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken)
    throw new CustomError('No refresh token found.', 401);

  //decoding client's refresh token and using it to find requested user from db
  const decodedIncomingRefreshToken = jwt.verify(
    incomingRefreshToken,
    config.refreshTokenSecret
  );
  const user = await User.findById(decodedIncomingRefreshToken?._id);
  if (!user) throw new CustomError('Invalid refresh token.', 401);

  //checking if client's refresh token is same as the one stored in db
  if (incomingRefreshToken !== user?.refreshToken)
    throw new CustomError('Invalid or expired refresh token.', 401);

  const { accessToken, refreshToken } = generateAccessAndRefreshToken(user);

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        'Access token refreshed.'
      )
    );
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!newPassword) throw new CustomError('New password is required.', 400);

  const user = req.user;

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) throw new CustomError('Incorrect password', 401);

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password changed successfully.'));
});

const changeAccountDetails = asyncHandler(async (req, res, next) => {
  const { email, fullname } = req.body;
  if (!email || !fullname)
    throw new CustomError(400, 'Both email and fullname are required.');

  const user = req.user;
  user.fullname = fullname;
  user.email = email;
  await user.save();

  const {
    _doc: { password, ...userDataToReturn },
  } = user;

  return res
    .status(200)
    .json(new ApiResponse(200, userDataToReturn, 'User updated successfully.'));
});

const changeAvatar = asyncHandler(async (req, res, next) => {
  const localFilePath = req?.file?.path;
  if (!localFilePath) throw new CustomError('No file path was provided.', 400);

  const avatarUrl = await uploadOnCloudinary(localFilePath);
  if (!avatarUrl)
    throw new CustomError(
      'An error occured while uploading the file to cloudinary.'
    );

  const user = req.user;
  user.avatar = avatarUrl;
  await user.save();

  const {
    _doc: { password, ...userDataToReturn },
  } = user;

  return res
    .status(200)
    .json(
      new ApiResponse(200, userDataToReturn, 'Avatar updated successfully.')
    );
});

export {
  getCurrentUser,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeAccountDetails,
  changePassword,
  changeAvatar,
};
