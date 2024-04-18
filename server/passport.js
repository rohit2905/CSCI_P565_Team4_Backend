const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new GoogleStrategy(
    {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, callback) {
        callback(null, profile);
    }
));

passport.use(new FacebookStrategy(
    {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/facebook/callback",
        profileFields: ['id', 'name', 'displayName', 'email']
    },
    function (accessToken, refreshToken, profile, callback) {
        callback(null, profile);
    }
));


passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});