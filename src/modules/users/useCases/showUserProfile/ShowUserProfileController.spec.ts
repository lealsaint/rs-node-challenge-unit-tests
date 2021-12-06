import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";
import { ShowUserProfileError } from "./ShowUserProfileError";

let connection: Connection;

describe("Show user profile", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to show user profile", async () => {
    const user = {
      name: "User Top",
      email: "user@example.com",
      password: "amazing",
    };

    await request(app).post("/api/v1/users").send(user);

    const authenticationResponse = await request(app)
      .post("/api/v1/sessions")
      .send(user);

    const { token } = authenticationResponse.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it("Should not be able to show user profile if user id does not exists", async () => {
    const user = {
      name: "User Top",
      email: "user@example.com",
      password: "amazing",
    };

    await request(app).post("/api/v1/users").send(user);
    await request(app).post("/api/v1/sessions").send(user);

    const token = "randomtoken";

    const response = await request(app)
      .get("/api/v1/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
});
