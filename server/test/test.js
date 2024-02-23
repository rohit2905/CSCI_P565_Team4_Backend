const {
    register,
    login,
    logout,
    resetpassword,
    newpassword,
    order,
    orderemail,
    readusers,
    readorders,
    readuserorders,
    orderupdate,
    orderstatus,
    adduseraccess,
    allUsers
} = require('../controllers/user.js');

const User = require('../models/user.js');

describe('Login Functionality', () => {
    // Test case for successful login
    test('Login with valid credentials', async () => {
        const req = {
            body: {
                userType: '10', // Provide userType
                email: 'krohitgoud@gmail.com', // Provide a valid email
                password: 'Rohit@2905', // Provide a valid password
                otp:"",
            }
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalled();
    }, 30000);

    // Test case for invalid credentials
    test('Login with invalid credentials', async () => {
        const req = {
            body: {
                userType: 'customer', // Provide userType
                email: 'test@example.com', // Provide a valid email
                password: 'wrongpassword' // Provide an invalid password
            }
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid email or password"
        });
    });

    // Test case for missing user
    test('Login with missing user', async () => {
        const req = {
            body: {
                userType: 'customer', // Provide userType
                email: 'nonexistent@example.com', // Provide an email that doesn't exist
                password: 'password123' // Provide a valid password
            }
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid Credentials"
        });
    });

    // Test case for missing OTP
    test('Login without OTP', async () => {
        const req = {
            body: {
                userType: 'customer', // Provide userType
                email: 'test@example.com', // Provide a valid email
                password: 'password123' // Provide a valid password
            }
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid Credentials"
        });
    });
});