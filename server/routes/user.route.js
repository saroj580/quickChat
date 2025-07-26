import express from 'express';
import { checkAuth, login, Signup, updateProfile } from '../controller/user.controller.js';
import { protectRoute } from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post('/signup', Signup);
userRouter.post('/login', login);
userRouter.put('/update-profile', protectRoute, updateProfile);
userRouter.get('/check', protectRoute, checkAuth);

export default userRouter;