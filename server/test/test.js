const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/user');
const bcrypt = require('bcrypt');
let mongoServer;

beforeAll(async () => {
    if (mongoose.connection.readyState) {
        await mongoose.disconnect();
    }
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('PING TEST /', () => {
    it('server and database is up', async () => {
        await request(app)
            .get('/')
            .expect(200);
    });
});

describe('Authentication API', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    test('should register a new user - customer', async () => {
        const response = await request(app)
            .post('/register')
            .send({ email: 'deliverwise@gmail.com', password: 'Test@123', username: 'tester', userType:10 })
            .expect(201);

        expect(response.body.message).toBe('Sign-up Successful');

    });

    test('should register a new user - admin', async () => {
        const response = await request(app)
            .post('/register')
            .send({ email: 'deliverwise@gmail.com', password: 'Test@123', username: 'tester', userType: 30 })
            .expect(201);

        expect(response.body.message).toBe('Sign-up Successful');

    });

    test('should register a new user - driver', async () => {
        const response = await request(app)
            .post('/register')
            .send({ email: 'deliverwise@gmail.com', password: 'Test@123', username: 'tester', userType: 20 })
            .expect(201);

        expect(response.body.message).toBe('Sign-up Successful');

    });

    test('should login the customer', async () => {
        // Create and save the user with the plaintext password which will be encrypted automatically
        const user = new User({
            username: 'tester',
            email: 'test@example.com',
            password: "password", // Use the virtual field
            userType: '10',
            otp: '1234'
        });
        await user.save();

        // Ensure the user is saved and the password is encrypted
        const savedUser = await User.findOne({ email: 'test@example.com' });
        expect(savedUser).toBeTruthy();
        expect(savedUser.authenticate("password")).toBe(true); // Authenticate method used for checking

        // Attempt to log in with the correct details
        const response = await request(app)
            .post('/login') // Make sure this matches your route
            .send({
                email: "test@example.com",
                password: "password",
                userType: '10',
                otp: "1234"
            })
            .expect(200); // Or the expected success status code based on your implementation

        expect(response.body.message).toBe('You have successfully logged in');
    });

    test('should login the admin', async () => {
        // Create and save the user with the plaintext password which will be encrypted automatically
        const user = new User({
            username: 'tester',
            email: 'test@example.com',
            password: "password", // Use the virtual field
            userType: '30',
            otp: '1234'
        });
        await user.save();

        // Ensure the user is saved and the password is encrypted
        const savedUser = await User.findOne({ email: 'test@example.com' });
        expect(savedUser).toBeTruthy();
        expect(savedUser.authenticate("password")).toBe(true); // Authenticate method used for checking

        // Attempt to log in with the correct details
        const response = await request(app)
            .post('/login') // Make sure this matches your route
            .send({
                email: "test@example.com",
                password: "password",
                userType: '30',
                otp: "1234"
            })
            .expect(200); // Or the expected success status code based on your implementation

        expect(response.body.message).toBe('You have successfully logged in');
    });

    test('should login the driver', async () => {
        // Create and save the user with the plaintext password which will be encrypted automatically
        const user = new User({
            username: 'tester',
            email: 'test@example.com',
            password: "password", // Use the virtual field
            userType: '20',
            otp: '1234'
        });
        await user.save();

        // Ensure the user is saved and the password is encrypted
        const savedUser = await User.findOne({ email: 'test@example.com' });
        expect(savedUser).toBeTruthy();
        expect(savedUser.authenticate("password")).toBe(true); // Authenticate method used for checking

        // Attempt to log in with the correct details
        const response = await request(app)
            .post('/login') // Make sure this matches your route
            .send({
                email: "test@example.com",
                password: "password",
                userType: '20',
                otp: "1234"
            })
            .expect(200); // Or the expected success status code based on your implementation

        expect(response.body.message).toBe('You have successfully logged in');
    });

    test('invalid OTP', async () => {
        // Create and save the user with the plaintext password which will be encrypted automatically
        const user = new User({
            username: 'tester',
            email: 'test@example.com',
            password: "password", // Use the virtual field
            userType: '10',
            otp: '1234'
        });
        await user.save();

        // Ensure the user is saved and the password is encrypted
        const savedUser = await User.findOne({ email: 'test@example.com' });
        expect(savedUser).toBeTruthy();
        expect(savedUser.authenticate("password")).toBe(true); // Authenticate method used for checking

        // Attempt to log in with the correct details
        const response = await request(app)
            .post('/login') // Make sure this matches your route
            .send({
                email: "test@example.com",
                password: "password",
                userType: '10',
                otp: "123"
            })
            .expect(401); // Or the expected success status code based on your implementation

        expect(response.body.error).toBe('Invalid OTP');
    });

    test('incorrect password login', async () => {
        // Create and save the user with the plaintext password which will be encrypted automatically
        const user = new User({
            username: 'tester',
            email: 'test@example.com',
            password: "password", // Use the virtual field
            userType: '10',
            otp: '1234'
        });
        await user.save();

        // Ensure the user is saved and the password is encrypted
        const savedUser = await User.findOne({ email: 'test@example.com' });
        expect(savedUser).toBeTruthy();
        expect(savedUser.authenticate("password")).toBe(true); // Authenticate method used for checking

        // Attempt to log in with the correct details
        const response = await request(app)
            .post('/login') // Make sure this matches your route
            .send({
                email: "test@example.com",
                password: "password23",
                userType: '10',
                otp: "1234"
            })
            .expect(401); // Or the expected success status code based on your implementation

        expect(response.body.error).toBe('Invalid email or password');
    });

    test('incorrect email', async () => {
        // Create and save the user with the plaintext password which will be encrypted automatically
        const user = new User({
            username: 'tester',
            email: 'test@example.com',
            password: "password", // Use the virtual field
            userType: '10',
            otp: '1234'
        });
        await user.save();

        // Ensure the user is saved and the password is encrypted
        const savedUser = await User.findOne({ email: 'test@example.com' });
        expect(savedUser).toBeTruthy();
        expect(savedUser.authenticate("password")).toBe(true); // Authenticate method used for checking

        // Attempt to log in with the correct details
        const response = await request(app)
            .post('/login') // Make sure this matches your route
            .send({
                email: "test@exadfdsmple.com",
                password: "password23",
                userType: '10',
                otp: "1234"
            })
            .expect(401); // Or the expected success status code based on your implementation

        expect(response.body.error).toBe('Invalid Credentials');
    });
});

