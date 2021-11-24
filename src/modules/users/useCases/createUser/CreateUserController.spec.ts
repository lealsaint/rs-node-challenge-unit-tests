import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Create a new user", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new user", async () => {
    const user = {
      name: "User 1",
      email: "user1@example.com",
      password: "amazing",
    };

    const response = await request(app).post("/api/v1/users").send(user);

    expect(response.status).toBe(201);
  });

  it("Should not be able to create users with same email", () => {
    expect(async () => {
      const user = {
        name: "User Example",
        email: "example@example.com",
        password: "amazing",
      };

      const otherUser = {
        name: "User New",
        email: "example@example.com",
        password: "amazing",
      };

      await request(app).post("/api/v1/users").send(user);
      const response = await request(app).post("/api/v1/users").send(otherUser);

      expect(response.status).toBe(400);
    });
  });
});
