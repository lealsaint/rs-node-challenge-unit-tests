import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Authenticate user", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to authenticate user", async () => {
    const user = {
      name: "User 1",
      email: "user1@example.com",
      password: "amazing",
    };

    await request(app).post("/api/v1/users").send(user);

    const response = await request(app).post("/api/v1/sessions").send(user);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("token");
  });

  it("Should not be able to authenticate user if credentials not match", async () => {
    const user = {
      name: "Incorrect user",
      email: "incorrect@example.com",
      password: "amazing",
    };

    await request(app).post("/api/v1/users").send(user);

    const { email } = user;

    const response = await request(app).post("/api/v1/sessions").send({
      email,
      password: "beautiful",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
});
