import { Router } from "express";
import validation from "../middleware/validation.js";
import registerValidation from "../validation/registerValidation.js";
import {
  deleteUser,
  forgotPassword,
  loginUser,
  myProfile,
  readAllUser,
  readUserById,
  registerCreate,
  resetPassword,
  updatePassword,
  updateProfile,
  updateSpecificUser,
  verifyEmail,
} from "./registerController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import authorized from "../middleware/authorized.js";

const registerRouter = Router();
registerRouter
  .route("/")
  .post(validation(registerValidation), registerCreate)
  .get(isAuthenticated, authorized(["admin", "superadmin"]), readAllUser);

// .get(registerRead);
registerRouter.route("/verify-email").patch(verifyEmail);
registerRouter.route("/login").patch(loginUser);
registerRouter.route("/my-profile").get(isAuthenticated, myProfile);
registerRouter.route("/update-profile").patch(isAuthenticated, updateProfile);
registerRouter.route("/update-password").patch(
  isAuthenticated, //to send token
  updatePassword
);
registerRouter.route("/forgot-password").post(forgotPassword);
registerRouter.route("/reset-password").patch(isAuthenticated, resetPassword);

registerRouter
  .route("/:id")
  .get(isAuthenticated, authorized(["admin", "superadmin"]), readUserById) //admin,superadmin
  .patch(
    isAuthenticated,
    authorized(["admin", "superadmin"]),
    updateSpecificUser
  ) //admin,super admin
  .delete(isAuthenticated, authorized(["superadmin"]), deleteUser); //superadmin

export default registerRouter;

//admin=>user read
//superadmin=>user read, delete user
//customer=> does not have permission to read
