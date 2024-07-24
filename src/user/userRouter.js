import { Router } from 'express';
import { loginUser, logoutUser, registerUser } from './userController.js';
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
userRouter.post('/logout', verifyJwt, logoutUser);

export default userRouter;
