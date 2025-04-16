const User = require("../models/user");
module.exports.renderSignup = (req, res) => {
  res.render("./user/signup.ejs");
};

module.exports.postSignup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let user = new User({ email, username });
    let registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("./user/login.ejs");
};

module.exports.postLogin = (req, res) => {
  req.flash("success", "Welcome back to WanderLust!");
  let Url = res.locals.redirectUrl || "/listings";
  res.redirect(Url);
};

module.exports.Logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "You are logged out now");
    res.redirect("/listings");
  });
};
