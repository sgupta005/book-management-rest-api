import asyncHandler from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ msg: 'ok' });
});

export { registerUser };
