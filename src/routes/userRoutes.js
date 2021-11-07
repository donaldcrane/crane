import { Router } from "express";
import UserController from "../controllers/user";
import validator from "../middlewares/validator";
import Authentication from "../middlewares/auth";
import parser from "../middlewares/uploads";
import {
  registerValidation, loginValidation, verifyValidation, recoverValidation, resetValidation, profileValidation
} from "../validators/user";

const router = Router();

const { authenticate } = Authentication;
const {
  createUser, signin, uploadPicture, updateProfile, verifyUser, recoverAccount, resetPassword
} = UserController;

router.post("/register", validator(registerValidation, false), createUser);
router.post("/signin", validator(loginValidation, false), signin);
router.post("/recover", validator(recoverValidation, false), recoverAccount);

router.patch("/verify", validator(verifyValidation, false), verifyUser);
router.patch("/reset", validator(resetValidation, false), resetPassword);
router.patch("/update/profile", authenticate, validator(profileValidation, false), updateProfile);
router.patch("/update/profile_image", authenticate, parser.single("image"), uploadPicture);

export default router;
