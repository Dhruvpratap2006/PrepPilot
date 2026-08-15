const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../src/models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        // 1. Pehle check karo ki user email ya googleId se exist karta hai ya nahi
        let user = await userModel.findOne({
          $or: [{ email: email }, { googleId: profile.id }],
        });

        // 2. Agar user nahi mila, toh naya unique username generate karke create karo
        if (!user) {
          // Display name ya email prefix se alphanumeric base banao
          const baseName = (profile.displayName || email.split("@")[0])
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

          // 5-digit random string add karo duplicate avoid karne ke liye
          const randomSuffix = Math.random().toString(36).substring(2, 7);
          const generatedUsername = `${baseName || "user"}_${randomSuffix}`;

          user = await userModel.create({
            name: profile.displayName,
            email: email,
            username: generatedUsername, // <-- Added unique username
            googleId: profile.id,
          });
        } else if (!user.googleId) {
          // Agar email se pehle register tha but googleId missing hai, toh link karo
          user.googleId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;