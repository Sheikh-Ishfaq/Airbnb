const express = require("express");
const wrapAsync = require("../util/wrapAsync");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// SIGN UP GET AND POST ROUTE
router
  .route("/signup")
  .get(userController.renderSignup)
  .post(wrapAsync(userController.postSignup));

// LOGIN GET AND POST ROUTE
router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.postLogin
  );

// LOG OUT ROUTE
router.get("/logout", userController.Logout);

module.exports = router;
