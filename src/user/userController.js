import { validationResult } from 'express-validator';
import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../utils/CustomError.js';

const registerUser = asyncHandler(async (req, res, next) => {
  //validation
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res
      .status(400)
      .json(result.array().map((err) => ({ field: err.path, msg: err.msg })));
  }

  const { email, fullname, avatar, password } = req.body;
  return res.status(200).json({ msg: 'ok' });
});

export { registerUser };
