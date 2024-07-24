import { Router } from 'express';
import { loginUser, registerUser } from './userController.js';
import { checkSchema } from 'express-validator';
import { userValidationSchema } from './userValidationSchema.js';
import { upload } from '../middlewares/multer.js';

const userRouter = Router();

userRouter.post(
  '/register',
  upload.single('avatar'),
  checkSchema(userValidationSchema),
  registerUser
);

userRouter.post('/login', loginUser);

export default userRouter;
