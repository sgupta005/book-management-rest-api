import { Router } from 'express';
import {
  changeAccountDetails,
  changePassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from './userController.js';
import { checkSchema } from 'express-validator';
import { userValidationSchema } from './userValidationSchema.js';
import { upload } from '../middlewares/multer.js';
import verifyJwt from '../middlewares/auth.js';

const userRouter = Router();

userRouter.post(
  '/register',
  upload.single('avatar'),
  checkSchema(userValidationSchema),
  registerUser
);

userRouter.post('/login', loginUser);

//Authorized Routed
userRouter.get('/current-user', verifyJwt, getCurrentUser);
userRouter.post('/logout', verifyJwt, logoutUser);
userRouter.post('/refresh-token', refreshAccessToken);
userRouter.post('/change-password', verifyJwt, changePassword);
userRouter.post('/change-details', verifyJwt, changeAccountDetails);

export default userRouter;
