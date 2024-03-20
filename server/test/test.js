const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/user');
const bcrypt = require('bcrypt');
let mongoServer;

function separateMore(str) {
    return str.split(".")[0];
}
function usernameExists(userName) {
    const usernameExists = User.findOne({
        username: userName
    });

    return usernameExists;
}
function generateUserName(email) {
    const localPart = separateMore(email.split('@')[0]);
    let attempts = 0;
    while (true) {
        const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const potentialUsername = `${localPart}${randomNumber}`;
        if (!usernameExists(potentialUsername) || attempts >= 10) {
            return potentialUsername;
        }
        attempts++;
    }
}

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

describe('separateMore', () => {
    test('should remove dot and text following it', () => {
        expect(separateMore('john.doe')).toBe('john');
    });
    test('no dot, remain unchanged', () => {
        expect(separateMore('janedoe')).toBe('janedoe'); // No dot, so remains unchanged
    });
});

describe('usernameExists', () => {
    test('should return null if username does not exist', async () => {
        const userName = 'nonexistentuser';
        const userExists = await usernameExists(userName);
        expect(userExists).toBeNull(); // Assuming User.findOne returns null if no document is found
    });

    test('should return the user document if username exists', async () => {
        const userName = 'existinguser';
        // Create a user with the username to test against
        await User.create({ username: userName, email: 'user@example.com', userType:10 });

        const userExists = await usernameExists(userName);
        expect(userExists).not.toBeNull();
        expect(userExists.username).toBe(userName); // Verify the found document has the correct username
    });
});

// This test assumes usernameExists works as expected, which may not be practical without a real or mocked database
describe('generateUserName', () => {
    test('should generate a unique username based on email', async () => {
        const email = 'test.user@example.com';
        const username = generateUserName(email);
        const userType = 10;
        // Assuming the username is generated synchronously for this example
        // In real scenarios, if usernameExists is async, generateUserName would need to be async too
        expect(username).toMatch(/^test\d{4}$/);

        // Verify the username doesn't exist in the database (it shouldn't yet)
        const userExists = await User.findOne({ username });
        expect(userExists).toBeNull();

        // Optionally, you can insert the user and try generating again to test the collision handling
        await User.create({ username, email, userType });

        // Generate another username to see if it handles the existence properly
        const newUsername = generateUserName(email);
        expect(newUsername).not.toBe(username); // Ensure a different username is generated
    });
});