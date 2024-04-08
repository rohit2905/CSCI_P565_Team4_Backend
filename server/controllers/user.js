const User = require('../models/user');
const Order = require('../models/order');
const Service = require('../models/services')
const Useraccess = require('../models/useraccess');
const jwt = require("jsonwebtoken");
require("dotenv").config();

const crypto = require('crypto');

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'deliverwise@gmail.com', // Your Gmail email address
        pass: 'hier ctda hdlb lort' // Your Gmail password
    }
});



// Generate a Unique Username 
function generateUserName(email) {
    const localPart = separateMore(email.split('@')[0]);
    let attempts = 0;
    while (true) {
        // Generate a random number between 0000 and 9999
        const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const potentialUsername = `${localPart}${randomNumber}`;
        // Check if the generated username already exists
        if (!usernameExists(potentialUsername) || attempts >= 10) {
            // If it doesn't exist or we've tried too many times, use this one
            return potentialUsername;
        }
        attempts++;
    }
}

// This function furthur breaks down large emails
function separateMore(str) {
    return str.split(".")[0];
}


// implementation of usernameExists function
function usernameExists(userName) {
    const usernameExists = User.findOne({
        username: userName
    });

    return usernameExists;
}
exports.register = async (req, res) => {

    const userName = generateUserName(req.body.email);
    // check if user already exists
    const usernameExists = await User.findOne({
        username: userName,
        userType: req.body.userType
    });
    const emailExists = await User.findOne({
        email: req.body.email,
        userType: req.body.userType
    });

    const useraccessExists = await Useraccess.findOne({
        userType: req.body.userType,
        email: req.body.email,
    });
    if (!(useraccessExists) == null) {
        return res.status(403).json({
            error: "User doesn't have access to create required account",
        });
    }

    if (usernameExists) {
        return res.status(403).json({
            error: "Username is taken, choose different username",
        });
    }
    if (emailExists) {
        return res.status(403).json({
            error: "Email is taken, use this email to login or use another email to signup",
        });
    }

    // Add the username to the request
    req.body["username"] = userName;
    // if new user, let's create the user
    const user = new User(req.body);
    await user.save();

    if (process.env.ENV != 'test') {
        transporter.sendMail({
            to: user.email,
            from: "deliverwise@gmail.com",
            subject: "signup successful",
            html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to DeliverWise</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            padding: 20px;
                            background-color: #fff;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #333;
                            text-align: center;
                        }
                        p {
                            color: #666;
                            line-height: 1.6;
                        }
                        .footer {
                            margin-top: 20px;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Welcome to DeliverWise</h1>
                        <p>Dear ${userName.slice(0, -4)},</p>
                        <p>Thank you for signing up with DeliverWise! We're excited to have you on board.</p>
                        <h3>Your Username: ${userName}</h3>
                        <p>With DeliverWise, you can enjoy convenient and reliable delivery services right at your fingertips.</p>
                        <p>If you have any questions or need assistance, feel free to reach out to our support team at deliverwise@gmail.com.</p>
                        <p>Best regards,</p>
                        <p>The DeliverWise Team</p>
                    </div>
                </body>
                </html>
                `
        });
    }
    res.status(201).json({
        message: "Sign-up Successful",
    });
};

exports.login = async (req, res) => {
    // find the user by email
    const { userType, email, password, otp } = req.body;

    if (otp) {
        await User.findOne({ userType: userType, email: email }).exec((err, user) => {
            // if error or no user
            if (err || !user) {
                return res.status(401).json({
                    error: "Invalid Credentials",
                });
            }
            if (otp != user.otp) {
                return res.status(401).json({
                    error: "Invalid OTP",
                });
            }


            // is user is found, we authenticate method from model
            if (!user.authenticate(password)) {
                return res.status(401).json({
                    error: "Invalid email or password",
                });
            }

            // generate a token with user id and  jwt secret
            console.log("after login: ", user);
            console.log("jwT: ",process.env.JWT_SECRET);
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });

            // persist the token as 'jwt' in cookie with an expiry date
            const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000); 
            res.cookie("jwt", token, { expires: expiryDate, sameSite: "none" });
            if (user.passReset) {

                User.findOneAndUpdate({ userType: req.body.userType, email: req.body.email },
                    { passReset: false },
                    { new: true },
                    (err, updatedUser) => {
                        if (err || !updatedUser) {
                            console.error("Failed to update passReset field");
                            // Handle error here
                        }
                    }
                );
            }
            // Update is_online flag
            User.findOneAndUpdate({ userType: req.body.userType, email: req.body.email }, { is_online: true }, (err, updatedUser) => {
                if (err) {
                    console.error("Failed to update is_online flag");
                    // Handle error here
                }
            });



            // return the response with the user
            const { email, userType, username } = user;
            return res.status(200).json({
                message: "You have successfully logged in",
                email,
                username,
                userType,
            });

        });
    }


    // to send otp if it does not exist
    else {
        const { userType, email } = req.body;

        var dw_otp = Math.random();
        dw_otp = dw_otp * 1000000;
        dw_otp = parseInt(dw_otp);

        // create transporter to send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'deliverwise@gmail.com', // Your Gmail email address
                pass: 'hier ctda hdlb lort' // Your Gmail password
            }
        });

        await User.findOne({ email: email, userType: userType })
            .then(user => {
                if (!user) {
                    return res.status(422).json({
                        error: "User doesn't exist with that email/user type"
                    })
                }
                if (!user.authenticate(password)) {
                    return res.status(401).json({
                        error: "Invalid email or password",
                    });
                }
                user.otp = dw_otp
                user.expireotp = Date.now() + 1200000
                user.save().then((result) => {
                    transporter.sendMail({
                        to: user.email,
                        from: "deliverwise@gmail.com",
                        subject: "OTP to log into DeliverWise",
                        html: `
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>OTP for Two-Factor Authentication - DeliverWise</title>
                            <style>
                                /* Include your CSS styles here */
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    margin: 0;
                                    padding: 0;
                                }
                                .container {
                                    max-width: 600px;
                                    margin: 20px auto;
                                    padding: 20px;
                                    background-color: #fff;
                                    border-radius: 8px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }
                                h1 {
                                    color: #333;
                                    text-align: center;
                                }
                                p {
                                    color: #666;
                                    line-height: 1.6;
                                }
                                .otp {
                                    font-size: 24px;
                                    font-weight: bold;
                                    text-align: center;
                                    margin-top: 20px;
                                    margin-bottom: 30px;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>Two-Factor Authentication - DeliverWise</h1>
                                <p>Dear ${user.email},</p>
                                <p>Your One-Time Password (OTP) for Two-Factor Authentication is:</p>
                                <div class="otp">${dw_otp}</div>
                                <p>Please use this OTP to log in to your DeliverWise account.</p>
                                <p>If you did not request this OTP, please ignore this email.</p>
                            </div>
                        </body>
                        </html>
                    `
                    })
                    const { passReset } = user;
                    res.json({ message: "OTP sent to E-Mail", passReset, })
                })

            })
    }
};

async function updateFlag(id) {
    try {
        const user = await User.findOne({ username : id });
        if (!user) {
            console.log("User not found");
        } else {
        user.is_online = false;
        await user.save();
        }
    } catch (error) {
        console.error("Error logging out:", error);
    }
}


exports.logout = (req, res) => {
    console.log("id", req.params.id);
    updateFlag(req.params.id)
        .then(() => {
            // clear the cookie
            res.clearCookie("jwt");
            return res.json({
                message: "Logout Successful"
            });
        })
};

// add a new service
exports.addservice = async (req, res) => {
    const service = new Service(req.body)
    try {
        await service.save()
        res.status(201).json({
            status: 'Success',
            data: {
                service
            }
        })
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err
        })
    }
};

// delete a service
exports.removeservice = async (req, res) => {
    await Service.findByIdAndDelete(req.params.id)

    try {
        res.status(204).json({
            status: 'Success',
            data: {
                "message": "Service Deleted"
            }
        })
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err
        })
    }

};

exports.updateservice = async (req, res) => {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    try {
        res.status(200).json({
            status: 'Success',
            data: {
                updatedService
            }
        })
    } catch (err) {
        console.log(err)
    }
}

exports.getLoggedInUser = (req, res) => {
    const { userType, username, _id, email } = req.user;

    return res.status(200).json({
        message: "User is still logged in",
        userType,
        username,
        _id,
        email
    });
};

exports.resetpassword = (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token_rs = buffer.toString("hex")
        User.findOne({ userType: req.body.userType, email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({
                        error: "User doesn't exist with that email/ usertype"
                    })
                }
                user.resetToken = token_rs
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {
                    transporter.sendMail({
                        to: user.email,
                        from: "deliverwise@gmail.com",
                        subject: "Reset Password",
                        html: `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Password Reset Email</title>
                            <style>
                                /* Add your email styles here */
                                body {
                                    font-family: Arial, sans-serif;
                                    line-height: 1.6;
                                    margin: 0;
                                    padding: 0;
                                    background-color: #f4f4f4;
                                }
                                .container {
                                    max-width: 600px;
                                    margin: 20px auto;
                                    padding: 20px;
                                    background-color: #fff;
                                    border-radius: 5px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }
                                h2 {
                                    color: #333;
                                }
                                p {
                                    margin-bottom: 20px;
                                }
                                a {
                                    color: #007bff;
                                    text-decoration: none;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h2>Password Reset</h2>
                                <p>Hello ${user.email},</p>
                                <p>We have received a request to reset your password for your Deliverwise account. To proceed with resetting your password, please follow the instructions below:</p>
                                <ol>
                                    <li>Click on the following link to reset your password: <a href="${process.env.DEPLOY_URL}newpassword/${token_rs}">Reset Password</a></li>
                                    <li>You will be directed to a page where you can enter your new password.</li>
                                </ol>
                                <ul>
                                    <li>If you did not request a password reset, please ignore this email. Your account remains secure.</li>
                                </ul>
                                <p>If you encounter any issues or have questions, please feel free to contact our support team at <a href="mailto:deliverwise@gmail.com">DeliverWise Support</a>.</p>
                                <p>Thank you,</p>
                                <p>Team DeliverWise</p>
                            </div>
                        </body>
                        </html>
                     `
                    })
                    res.json({ message: "Password Reset Email Sent" })
                })

            })
    })
}

exports.newpassword = async (req, res) => {

    const newpassword = req.body.password
    const sentToken = req.body.token_rs

    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Password reset session expired" })
            }
            user.hashedPassword = crypto.createHmac("sha256", user.salt).update(newpassword).digest("hex");
            user.passReset = true
            user.resetToken = undefined;
            user.expireToken = undefined;
            user.save().then((saveduser) => {
                res.json({ message: "password updated successfully" })
            })

            transporter.sendMail({
                to: user.email,
                from: "deliverwise@gmail.com",
                subject: "Password reset successful",
                html: "<h1>Your password has been successfully reset</h1>"
            }).catch(err => {
                console.log(err)
            })

        });

};

exports.order = async (req, res) => {

    // let's create the order
    const order = new Order(req.body);
    await order.save();

    res.status(201).json({
        message: "You have successfully saved the order",
    });
};

exports.orderemail = async (req, res) => {
    const email = req.body.email;
    const cost = req.body.Cost;
    const trackingID = req.body.TrackingID;

    transporter.sendMail({
        to: email,
        from: "deliverwise@gmail.com",
        subject: "DeliverWise Payment Invoice",
        html: `<h2>Thank you for the recent payment that you made for the amount $ ${cost}.
            This is a confirmation that the amount has been received successfully.
            Your tracking ID is ${trackingID} .</h2>`
    }).catch(err => {
        console.log(err)
    })
};

exports.readusers = async (req, res) => {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    const userType = req.query.userType;

    try {
        const count = await User.countDocuments({ userType: userType });

        const users = await User.find({ userType: userType })
            .sort({ userType: 1, email: 1 })
            .skip((page - 1) * parseInt(perPage))
            .limit(parseInt(perPage));

        // success
        res.status(200).json({
            count,
            users,
        });
    } catch (error) {
        res.status(400).json({
            error: `Error getting data: ${error.message}`,
        });
    }
};

exports.readorders = async (req, res) => {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 5;

    try {
        const count = await Order.countDocuments({});

        const users = await Order.find({})
            .sort({ TrackingID: 1 })
            .skip((page - 1) * parseInt(perPage))
            .limit(parseInt(perPage));

        // success
        res.status(200).json({
            count,
            users,
        });
    } catch (error) {
        res.status(400).json({
            error: `Error getting data: ${error.message}`,
        });
    }
};

exports.readuserorders = async (req, res) => {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    const userType = req.query.userType;
    if (userType == 10) {
        const Customer = req.query.email;
        try {
            const count = await Order.countDocuments({ Customer: Customer });

            const users = await Order.find({ Customer: Customer })
                .sort({ TrackingID: 1 })
                .skip((page - 1) * parseInt(perPage))
                .limit(parseInt(perPage));
            // success
            res.status(200).json({
                count,
                users,
            });
        } catch (error) {
            res.status(400).json({
                error: `Error getting data: ${error.message}`,
            });
        }
    } else if (userType == 20) {
        const Driver = req.query.email;
        try {
            const count = await Order.countDocuments({ Driver: Driver });

            const users = await Order.find({ Driver: Driver })
                .sort({ TrackingID: 1 })
                .skip((page - 1) * parseInt(perPage))
                .limit(parseInt(perPage));
            // success
            res.status(200).json({
                count,
                users,
            });
        } catch (error) {
            res.status(400).json({
                error: `Error getting data: ${error.message}`,
            });
        }
    }

};

exports.orderupdate = async (req, res) => {
    const trackingID = req.body.TrackingID_u;
    const Driver = req.body.Driver_u;
    const OrderStatus = req.body.OrderStatus_u;
    const Location = req.body.Location_u;

    let order = await Order.findOne({ TrackingID: trackingID }).exec();
    if (!order) {
        return res.status(422).json({ error: "TrackingID not found!" })
    }
    if (!Driver && !Location) {
        order.OrderStatus = OrderStatus;
        await order.save();
        res.status(201).json({ message: "Order status updated", });
    } else if (!OrderStatus && !Location) {
        order.Driver = Driver;
        await order.save();
        res.status(201).json({ message: "Driver details updated", });
    } else if (!OrderStatus && !Driver) {
        order.Location = Location;
        await order.save();
        res.status(201).json({ message: "Order location updated", });
    } else if (!Location) {
        order.Driver = Driver;
        order.OrderStatus = OrderStatus;
        await order.save();
        res.status(201).json({ message: "Driver and Order status updated", });
    } else if (!Driver) {
        order.Location = Location;
        order.OrderStatus = OrderStatus;
        await order.save();
        res.status(201).json({ message: "Order status and location updated", });
    } else if (!OrderStatus) {
        order.Location = Location;
        order.Driver = Driver;
        await order.save();
        res.status(201).json({ message: "Driver and location updated", });
    } else {
        order.Location = Location;
        order.OrderStatus = OrderStatus;
        order.Driver = Driver;
        await order.save();
        res.status(201).json({ message: "Drive, Order status and location updated", });
    }
};

exports.orderstatus = async (req, res) => {
    const TrackingID = req.query.TrackingID;
    try {
        const order = await Order.findOne({ TrackingID: TrackingID }).exec();
        const Carrier = order.Carrier;
        const OrderStatus = order.OrderStatus;
        const Address_f = order.Address_f;
        const Address_t = order.Address_t;
        const Location = order.Location;
        res.status(200).json({
            message: "Order details fetched",
            Carrier,
            OrderStatus,
            Address_f,
            Address_t,
            Location
        });
    } catch (error) {
        res.status(400).json({
            error: `Tracking ID not found`,
        });
    }
};

exports.adduseraccess = async (req, res) => {
    // check if user already exists
    const useraccessExists = await Useraccess.findOne({
        userType: req.body.userType,
        email: req.body.email,
    });

    if (useraccessExists) {
        return res.status(403).json({
            error: "User has been already given access",
        });
    }

    // if new useraccess, let's create the useraccess
    const useraccess = new Useraccess(req.body);
    await useraccess.save();

    res.status(201).json({
        message: "User has been successfully granted access",
    });
};

exports.allUsers = async (req, res) => {

    const keyword = req.query.search

        ?
        {
            $or: [
                { username: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });


    res.send(users);
}


