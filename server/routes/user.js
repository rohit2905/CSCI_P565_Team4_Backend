const express = require("express");
const router = express.Router();

// import controllers
const { register, login, logout, getLoggedInUser, resetpassword, newpassword, order, orderemail, readusers, readorders, orderupdate, orderstatus, adduseraccess, readuserorders, allUsers, addservice, removeservice, updateservice, drivers, verifyEmail, validateSecurityAnswers, securityQuestion ,order_details_for_dashboard, order_details_for_dashboard_Admin} = require("../controllers/user");

// import middlewares
const {userRegisterValidator, userById} = require('../middlewares/user');
const {verifyToken} = require('../middlewares/auth');


// api routes
router.post("/register",userRegisterValidator, register);
router.post("/login", login);
router.get("/logout/:id", logout);

router.get('/user', verifyToken, userById, getLoggedInUser);

router.post("/resetpassword", resetpassword);

router.get("/drivers", drivers);

router.post("/newpassword", newpassword);

router.post("/order", order);

router.post("/orderemail", orderemail);

router.get("/users", readusers);

router.get("/orders", readorders);
router.get("/ordersDashboard", order_details_for_dashboard);
router.get("/ordersDashboardAdmin", order_details_for_dashboard_Admin);
router.get("/userorders", readuserorders);

router.post("/orderupdate", orderupdate);

router.get("/orderstatus", orderstatus);

router.post("/adduseraccess", adduseraccess);

router.get('/alluser',verifyToken,userById, allUsers );

router.post('/addservice', addservice);

router.patch('/updateservice/:id', updateservice);

router.delete('/removeservice/:id', removeservice);

router.post('/validate-security-answer', validateSecurityAnswers);

router.get('/verify-email', verifyEmail);

router.get('/security-question', securityQuestion);


module.exports = router;