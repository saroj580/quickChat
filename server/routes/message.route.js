import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import { getMessages, getUserForSideBar, markMessageAsSeen, sendMessage } from "../controller/message.controller.js";

const messageRouter = express.Router();

messageRouter.get('/users', protectRoute, getUserForSideBar);
messageRouter.get('/:id', protectRoute, getMessages);
messageRouter.put('mark/:id', protectRoute, markMessageAsSeen);
messageRouter.post('/send/:id', protectRoute, sendMessage);

export default messageRouter;