const request = require("supertest");
const app = require("../app");

describe("Authentication Controller - Signup", () => {
  it("should handle signup request", async () => {
    // Przykład testu dla signup
    const userData = {
      email: "test@example.com",
      password: "testPassword",
    };

    const response = await request(app)
      .post("/api/users/signup")
      .send(userData)
      .expect(201);

    // Sprawdź oczekiwane wyniki w odpowiedzi
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", userData.email);
    expect(response.body.user).toHaveProperty("subscription", "starter");
  });

  it("should return 400 when email or password is missing", async () => {
    // Przykład testu dla nieprawidłowych danych
    const userData = {
      email: "test@example.com",
    };

    const response = await request(app)
      .post("/api/users/signup")
      .send(userData)
      .expect(400);

    // Sprawdź oczekiwane wyniki w odpowiedzi
    expect(response.body).toHaveProperty("message", "Validation error");
  });

  it("should return 409 when email is already in use", async () => {
    // Przykład testu dla istniejącego użytkownika
    const existingUser = {
      email: "test@example.com",
      password: "testPassword",
    };

    // Dodaj istniejącego użytkownika do bazy danych przed testem
    // Tutaj dodaj kod, który utworzy istniejącego użytkownika

    const userData = {
      email: "test@example.com",
      password: "testPassword",
    };

    const response = await request(app)
      .post("/api/users/signup")
      .send(userData)
      .expect(409);

    // Sprawdź oczekiwane wyniki w odpowiedzi
    expect(response.body).toHaveProperty("message", "Email in use");
  });

  // Dodaj więcej testów dla signup, jeśli są potrzebne
});

describe("Authentication Controller - Login", () => {
  it("should handle login request", async () => {
    // Przykład testu dla login
    const userData = {
      email: "test@example.com",
      password: "testPassword",
    };

    const response = await request(app)
      .post("/api/users/login")
      .send(userData)
      .expect(200);

    // Sprawdź oczekiwane wyniki w odpowiedzi
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", userData.email);
    expect(response.body.user).toHaveProperty("subscription", "starter");
  });

  it("should return 400 when email or password is missing", async () => {
    // Przykład testu dla nieprawidłowych danych
    const userData = {
      email: "test@example.com",
    };

    const response = await request(app)
      .post("/api/users/login")
      .send(userData)
      .expect(400);

    // Sprawdź oczekiwane wyniki w odpowiedzi
    expect(response.body).toHaveProperty("message", "Validation error");
  });

  it("should return 401 when email or password is wrong", async () => {
    // Przykład testu dla nieprawidłowego hasła
    const userData = {
      email: "test@example.com",
      password: "incorrectPassword",
    };

    const response = await request(app)
      .post("/api/users/login")
      .send(userData)
      .expect(401);

    // Sprawdź oczekiwane wyniki w odpowiedzi
    expect(response.body).toHaveProperty(
      "message",
      "Email or password is wrong"
    );
  });

  // Dodaj więcej testów dla login, jeśli są potrzebne
});
