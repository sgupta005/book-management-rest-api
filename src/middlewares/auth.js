import { config } from '../config.js';
import { User } from '../user/userModel.js';
import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../utils/CustomError.js';
import jwt from 'jsonwebtoken';

const verifyJwt = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) throw new CustomError('No Access Token Found', 401);

  const decodedToken = jwt.verify(token, config.accessTokenSecret);

  const user = await User.findById(decodedToken._id);
  if (!user) throw new CustomError('Invalid Access Token', 401);

  req.user = user;
  next();
});

export default verifyJwt;
