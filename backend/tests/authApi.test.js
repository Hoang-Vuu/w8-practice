const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/userModel");
const Property = require("../models/propertyModel");

const MONGO_URI = process.env.TEST_MONGO_URI || process.env.MONGO_URI;

beforeAll(async () => {
  if (!MONGO_URI) {
    throw new Error("Missing TEST_MONGO_URI or MONGO_URI in environment for tests");
  }
  await mongoose.connect(MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Property.deleteMany({});
});

describe("Authentication API", () => {
  const validUser = {
    name: "Test User",
    email: "test@example.com",
    password: "Test123!@#Strong",
    phoneNumber: "1234567890",
    gender: "male",
    dateOfBirth: "1990-01-01",
    address: {
      street: "123 Main St",
      city: "Ho Chi Minh",
      state: "HCM",
      zipCode: "70000",
    },
  };

  describe("POST /api/users/signup", () => {
    test("should signup successfully with valid data", async () => {
      const res = await request(app)
        .post("/api/users/signup")
        .send(validUser)
        .expect(201);

      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("email");
      expect(res.body.email).toBe(validUser.email);
      expect(typeof res.body.token).toBe("string");
    });

    test("should fail signup without required fields", async () => {
      const res = await request(app)
        .post("/api/users/signup")
        .send({
          name: "Test User",
          email: "test@example.com",
          // missing password and other fields
        })
        .expect(400);

      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBeTruthy();
    });

    test("should fail signup with invalid email", async () => {
      const res = await request(app)
        .post("/api/users/signup")
        .send({
          ...validUser,
          email: "invalid-email",
        })
        .expect(400);

      expect(res.body).toHaveProperty("error");
    });

    test("should fail signup with weak password", async () => {
      const res = await request(app)
        .post("/api/users/signup")
        .send({
          ...validUser,
          password: "weak",
        })
        .expect(400);

      expect(res.body).toHaveProperty("error");
    });

    test("should fail signup with duplicate email", async () => {
      // First signup
      await request(app).post("/api/users/signup").send(validUser).expect(201);

      // Second signup with same email
      const res = await request(app)
        .post("/api/users/signup")
        .send({
          ...validUser,
          name: "Different Name",
        })
        .expect(400);

      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toContain("already");
    });
  });

  describe("POST /api/users/login", () => {
    beforeEach(async () => {
      // Create a user before login tests
      await request(app).post("/api/users/signup").send(validUser).expect(201);
    });

    test("should login successfully with valid credentials", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({
          email: validUser.email,
          password: validUser.password,
        })
        .expect(200);

      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("email");
      expect(res.body.email).toBe(validUser.email);
      expect(typeof res.body.token).toBe("string");
    });

    test("should fail login with non-existent email", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({
          email: "nonexistent@example.com",
          password: validUser.password,
        })
        .expect(400);

      expect(res.body).toHaveProperty("error");
    });

    test("should fail login with incorrect password", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({
          email: validUser.email,
          password: "WrongPassword123!@#",
        })
        .expect(400);

      expect(res.body).toHaveProperty("error");
    });

    test("should fail login with missing credentials", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({
          email: validUser.email,
          // missing password
        })
        .expect(400);

      expect(res.body).toHaveProperty("error");
    });
  });
});

describe("Protected Routes", () => {
  let token;
  const validUser = {
    name: "Test User",
    email: "test@example.com",
    password: "Test123!@#Strong",
    phoneNumber: "1234567890",
    gender: "male",
    dateOfBirth: "1990-01-01",
    address: {
      street: "123 Main St",
      city: "Ho Chi Minh",
      state: "HCM",
      zipCode: "70000",
    },
  };

  const sampleProperty = {
    title: "Beautiful House",
    type: "House",
    description: "A beautiful house in the city",
    price: 500000,
    location: {
      address: "456 Oak Ave",
      city: "Ho Chi Minh",
      state: "HCM",
    },
    squareFeet: 2000,
    yearBuilt: 2020,
    bedrooms: 4,
  };

  beforeEach(async () => {
    // Signup and get token
    const signupRes = await request(app)
      .post("/api/users/signup")
      .send(validUser)
      .expect(201);

    token = signupRes.body.token;
  });

  describe("GET /api/users/me", () => {
    test("should return user data with valid token", async () => {
      const res = await request(app)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty("_id");
    });

    test("should fail without authentication token", async () => {
      const res = await request(app)
        .get("/api/users/me")
        .expect(401);

      expect(res.body).toHaveProperty("error");
    });

    test("should fail with invalid token", async () => {
      const res = await request(app)
        .get("/api/users/me")
        .set("Authorization", "Bearer invalid_token_here")
        .expect(401);

      expect(res.body).toHaveProperty("error");
    });

    test("should fail without Bearer prefix", async () => {
      const res = await request(app)
        .get("/api/users/me")
        .set("Authorization", token)
        .expect(401);

      expect(res.body).toHaveProperty("error");
    });
  });

  describe("Protected Property Routes", () => {
    test("should create property with valid authentication", async () => {
      const res = await request(app)
        .post("/api/properties")
        .set("Authorization", `Bearer ${token}`)
        .send(sampleProperty)
        .expect(201);

      expect(res.body).toHaveProperty("_id");
      expect(res.body.title).toBe(sampleProperty.title);
    });

    test("should fail to create property without authentication", async () => {
      const res = await request(app)
        .post("/api/properties")
        .send(sampleProperty)
        .expect(401);

      expect(res.body).toHaveProperty("error");
    });

    test("should fail to create property with invalid token", async () => {
      const res = await request(app)
        .post("/api/properties")
        .set("Authorization", "Bearer invalid_token")
        .send(sampleProperty)
        .expect(401);

      expect(res.body).toHaveProperty("error");
    });
  });
});
