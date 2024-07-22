import { validationResult } from 'express-validator';
import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../utils/CustomError.js';
import { User } from './userModel.js';
import ApiResponse from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res, next) => {
  const { email, fullname, avatar, password } = req.body;

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

  //creating user
  const user = await User.create({
    email: email.toLowerCase(),
    fullname,
    avatar: avatar ?? '',
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

export { registerUser };
