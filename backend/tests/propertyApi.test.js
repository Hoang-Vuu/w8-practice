const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Property = require("../models/propertyModel");
const User = require("../models/userModel");

// Use TEST_MONGO_URI if you have it, fallback to MONGO_URI
const MONGO_URI = process.env.TEST_MONGO_URI || process.env.MONGO_URI;

const sampleProperty = () => ({
  title: "Modern City Apartment",
  type: "Apartment",
  description: "Bright, modern apartment in the city center",
  price: 250000,
  location: {
    address: "123 Main Street",
    city: "Helsinki",
    state: "Uusimaa",
  },
  squareFeet: 900,
  yearBuilt: 2018,
  bedrooms: 2,
});

let authToken = null;

beforeAll(async () => {
  if (!MONGO_URI) {
    throw new Error(
      "Missing TEST_MONGO_URI or MONGO_URI in environment for tests"
    );
  }
  await mongoose.connect(MONGO_URI);

  // Create a test user and get auth token
  const signupRes = await request(app)
    .post("/api/users/signup")
    .send({
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
    });

  authToken = signupRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Property.deleteMany({});
});

describe("Properties API", () => {
  describe("GET /api/properties", () => {
    test("should return 200 and empty array initially", async () => {
      const res = await request(app).get("/api/properties").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    test("should return properties sorted by createdAt desc (basic check)", async () => {
      const p1 = await Property.create(sampleProperty());
      const p2 = await Property.create({
        ...sampleProperty(),
        title: "Second Listing",
      });

      const res = await request(app).get("/api/properties").expect(200);

      // If createdAt timestamps are present, newest should be first.
      if (res.body.length >= 2 && res.body[0].createdAt && res.body[1].createdAt) {
        const firstDate = new Date(res.body[0].createdAt).getTime();
        const secondDate = new Date(res.body[1].createdAt).getTime();
        expect(firstDate).toBeGreaterThanOrEqual(secondDate);
      } else if (res.body.length >= 2) {
        // If timestamps are not present, at least ensure both created titles exist in the response.
        const titles = res.body.map((p) => p.title);
        expect(titles).toEqual(expect.arrayContaining([p1.title, p2.title]));
      } else {
        // If less than 2 results something else went wrong — fail the test explicitly
        throw new Error("Expected at least two properties in response");
      }
    });
  });

  describe("POST /api/properties", () => {
    test("should create a property and return 201", async () => {
      const payload = sampleProperty();

      const res = await request(app)
        .post("/api/properties")
        .set("Authorization", `Bearer ${authToken}`)
        .send(payload)
        .expect(201);

      expect(res.body.title).toBe(payload.title);
      expect(res.body.type).toBe(payload.type);
      expect(res.body.price).toBe(payload.price);

      expect(res.body.id || res.body._id).toBeTruthy();

      const count = await Property.countDocuments();
      expect(count).toBe(1);
    });

    test("should return 400 when missing required fields", async () => {
      const badPayload = {
        title: "Missing stuff",
      };

      const res = await request(app)
        .post("/api/properties")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400);

      expect(res.body.message).toMatch(/Failed to create property/i);
    });
  });

  describe("GET /api/properties/:propertyId", () => {
    test("should return 200 with a property by id", async () => {
      const created = await Property.create(sampleProperty());

      const res = await request(app)
        .get(`/api/properties/${created._id}`)
        .expect(200);

      expect(res.body.title).toBe(created.title);
    });

    test("should return 400 for invalid id", async () => {
      const res = await request(app)
        .get("/api/properties/invalid-id")
        .expect(400);

      expect(res.body.message).toMatch(/Invalid property ID/i);
    });

    test("should return 404 for valid but non-existing id", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .get(`/api/properties/${fakeId}`)
        .expect(404);

      expect(res.body.message).toMatch(/Property not found/i);
    });
  });

  describe("PUT /api/properties/:propertyId", () => {
    test("should update a property and return 200", async () => {
      const created = await Property.create(sampleProperty());

      const updatePayload = {
        title: "Updated Title",
        price: 300000,
      };

      const res = await request(app)
        .put(`/api/properties/${created._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatePayload)
        .expect(200);

      expect(res.body.title).toBe("Updated Title");
      expect(res.body.price).toBe(300000);
    });

    test("should return 400 for invalid id", async () => {
      const res = await request(app)
        .put("/api/properties/invalid-id")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ title: "X" })
        .expect(400);

      expect(res.body.message).toMatch(/Invalid property ID/i);
    });

    test("should return 404 for valid but non-existing id", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/api/properties/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ title: "X" })
        .expect(404);

      expect(res.body.message).toMatch(/Property not found/i);
    });
  });

  describe("DELETE /api/properties/:propertyId", () => {
    test("should delete a property and return 204", async () => {
      const created = await Property.create(sampleProperty());

      await request(app)
        .delete(`/api/properties/${created._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

      const found = await Property.findById(created._id);
      expect(found).toBeNull();
    });

    test("should return 400 for invalid id", async () => {
      const res = await request(app)
        .delete("/api/properties/invalid-id")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400);

      expect(res.body.message).toMatch(/Invalid property ID/i);
    });

    test("should return 404 for valid but non-existing id", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/api/properties/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(res.body.message).toMatch(/Property not found/i);
    });
  });
});