require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
// const Auth0Strategy = require("passport-auth0");
// Another way of using this in here insted of a file

const strategy = require("./strategy");

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(strategy);

passport.serializeUser((user, done) => {
  // done(null, { clientID: user.id, email: user._json.email, name: user._json.name });
  // When we want specif information from the user object we can extract that like above!
  done(null, user);
});

// passport.deserializeUser( (obj, done) => {
//     done(null, obj);
//   });
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  "/login",
  passport.authenticate("auth0", {
    successRedirect: "/me",
    failureRedirect: "/login",
    failureFlash: true
  })
);

function authenticated(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
}

app.get("/me", authenticated, (req, res, next) => {
  if (!req.user) {
    res.redirect("/login");
  } else {
    res.status(200).send(req.user);
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
