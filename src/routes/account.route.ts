import { Router } from "express";
import { getProfile, login, register } from "../controllers/account.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post('/signup', register);
router.post('/signin', login);
router.post('/profile', [protect], getProfile);

export default router;
