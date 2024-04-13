const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

router.get("/login/success", (req, res) => {
    if(req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully Logged In",
            user: req.user,
        })
    }
    else {
        res.status(403).json({
            error: true, 
            message: "Not Authorized"
        });
    }
})

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Login Failure",
    });
});

router.get("/google/callback", 
    passport.authenticate("google", { failureRedirect: "/login/failed" }),
    async (req, res) => {
        try {
            console.log(req);
            // Check if user already exists in your database
            let user = await User.findOne({ googleId: req.user.id });
            if (!user) {
                // If user doesn't exist, create a new one
                user = new User({
                    googleId: req.user.id,
                    email: req.user.emails[0].value,
                    username: req.user.displayName,
                    userType: "10",
                    is_online: true,
                });
                await user.save();
            }
            else {
                // If user exists, update is_online to true upon login
                user.is_online = true;
                await user.save();
            }
            console.log(user);
            // Generate JWT token and set it in cookie
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
            res.cookie("jwt", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: "None" });
            // Redirect to the portal with user details
            res.redirect(process.env.CLIENT_URL + "/Customer");
        } catch (error) {
            console.error("Error in Google callback:", error);
            res.status(500).json({
                error: true,
                message: "Internal Server Error",
            });
        }
    }
);

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get("/logout", (req, res) => {
    console.log("gwgege");
    res.clearCookie("jwt");
    req.logout();
    res.redirect(process.env.CLIENT_URL);
});


// Facebook callback route
router.get("/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login/failed" }),
    async (req, res) => {
        try {
            let user = await User.findOne({ facebookId: req.user.id });
            if (!user) {
                user = new User({
                    facebookId: req.user.id,
                    email: req.user.emails[0].value,
                    username: req.user.givenname,
                    userType: "10",
                    is_online: true,
                });
                await user.save();
            } else {
                user.is_online = true;
                await user.save();
            }
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
            res.cookie("jwt", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: "None" });
            res.redirect(process.env.CLIENT_URL + "/Customer");
        } catch (error) {
            console.error("Error in Facebook callback:", error);
            res.status(500).json({
                error: true,
                message: "Internal Server Error",
            });
        }
    }
);

// Facebook authentication route
router.get("/facebook", passport.authenticate("facebook", ["email"]));

module.exports = router;