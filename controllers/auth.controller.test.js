const request = require("supertest");
const app = require("../app");

describe("Authentication Controller - Signup", () => {
  it("should handle signup request", async () => {
    const userData = {
      email: "test@example.com",
      password: "testPassword",
    };

    const response = await request(app)
      .post("/api/users/signup")
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", userData.email);
    expect(response.body.user).toHaveProperty("subscription", "starter");
  });

  it("should return 400 when email or password is missing", async () => {
    const userData = {
      email: "test@example.com",
    };

    const response = await request(app)
      .post("/api/users/signup")
      .send(userData)
      .expect(400);

    expect(response.body).toHaveProperty("message", "Validation error");
  });

  it("should return 409 when email is already in use", async () => {
    const existingUser = {
      email: "test@example.com",
      password: "testPassword",
    };

    const userData = {
      email: "test@example.com",
      password: "testPassword",
    };

    const response = await request(app)
      .post("/api/users/signup")
      .send(userData)
      .expect(409);

    expect(response.body).toHaveProperty("message", "Email in use");
  });
});

describe("Authentication Controller - Login", () => {
  it("should handle login request", async () => {
    const userData = {
      email: "test@example.com",
      password: "testPassword",
    };

    const response = await request(app)
      .post("/api/users/login")
      .send(userData)
      .expect(200);

    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", userData.email);
    expect(response.body.user).toHaveProperty("subscription", "starter");
  });

  it("should return 400 when email or password is missing", async () => {
    const userData = {
      email: "test@example.com",
    };

    const response = await request(app)
      .post("/api/users/login")
      .send(userData)
      .expect(400);

    expect(response.body).toHaveProperty("message", "Validation error");
  });

  it("should return 401 when email or password is wrong", async () => {
    const userData = {
      email: "test@example.com",
      password: "incorrectPassword",
    };

    const response = await request(app)
      .post("/api/users/login")
      .send(userData)
      .expect(401);

    expect(response.body).toHaveProperty(
      "message",
      "Email or password is wrong"
    );
  });
});
