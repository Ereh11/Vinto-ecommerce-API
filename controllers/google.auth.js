const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.modle");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const axios = require("axios");

// Helper function to generate strong password
function generateStrongPassword() {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*()";

  // Ensure at least one of each required character type
  let password = "";
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Add more random characters to meet length requirement
  const allChars = uppercase + lowercase + numbers + special;
  for (let i = 0; i < 8; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

// Google signup strategy
passport.use(
  "google-signup",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/google/signup/callback",
      userProfile: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        // Check if user exists
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          return cb(null, false, {
            message: "Email already registered. Please login instead.",
          });
        }

        // Create user and cart in a transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          // Generate a strong password that meets requirements
          const password = generateStrongPassword();

          // Create user
          user = await User.create(
            [
              {
                email: profile.emails[0].value,
                username: profile.displayName,
                password: password,
                confirmPassword: password,
                role: "user",
                verified: true,
              },
            ],
            { session }
          );

          await session.commitTransaction();
          return cb(null, user[0]);
        } catch (error) {
          await session.abortTransaction();
          throw error;
        } finally {
          session.endSession();
        }
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);

// Google login strategy
passport.use(
  "google-login",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/google/login/callback",
      userProfile: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          return cb(null, false, {
            message: "No account found. Please signup first.",
          });
        }
        return cb(null, user);
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);

// Controllers
const googleSignup = passport.authenticate("google-signup", {
  scope: ["profile", "email"],
  prompt: "select_account",
});

const googleLogin = passport.authenticate("google-login", {
  scope: ["profile", "email"],
});

const googleSignupCallback = (req, res) => {
  console.log("Google signup callback reached");
  passport.authenticate("google-signup", async (err, user, info) => {
    try {
      console.log("Authentication result:", { err, user, info });
      if (err || !user) {
        return res.redirect(
          `http://localhost:4200/signup?error=${encodeURIComponent(
            err?.message || info?.message
          )}`
        );
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      // For new users, redirect to profile creation
      res.redirect(
        `http://localhost:4200/profile/create?token=${token}&userId=${user._id}&newUser=true`
      );
    } catch (error) {
      console.error("Callback error:", error);
      res.redirect(`http://localhost:4200/signup?error=signup_failed`);
    }
  })(req, res);
};

const googleLoginCallback = (req, res) => {
  passport.authenticate("google-login", async (err, user, info) => {
    try {
      if (err || !user) {
        return res.redirect(
          `http://localhost:4200/login?error=${encodeURIComponent(
            err?.message || info?.message
          )}`
        );
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      // For existing users, redirect to home
      res.redirect(
        `http://localhost:4200/home?token=${token}&userId=${user._id}`
      );
    } catch (error) {
      res.redirect(`http://localhost:4200/login?error=login_failed`);
    }
  })(req, res);
};

module.exports = {
  googleSignup,
  googleSignupCallback,
  googleLogin,
  googleLoginCallback,
};
