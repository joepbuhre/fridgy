import { Router, Request, Response } from "express";
import { LogoutUrl } from "../controllers/auth";
const auth = Router();

// router.use('/auth', auth)

auth.get("/logout", LogoutUrl);

export default auth;
