import { Router } from 'express';
import { registerUser } from './userController.js';
import { checkSchema } from 'express-validator';
import { userValidationSchema } from './userValidationSchema.js';

const userRouter = Router();

userRouter.post('/register', checkSchema(userValidationSchema), registerUser);

export default userRouter;
