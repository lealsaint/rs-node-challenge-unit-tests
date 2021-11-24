import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a new user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new user", async () => {
    const user = {
      name: "User 1",
      email: "user1@example.com",
      password: "amazing",
    };

    const createdUser = await createUserUseCase.execute(user);

    expect(createdUser).toHaveProperty("id");
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

      await createUserUseCase.execute(user);
      await createUserUseCase.execute(otherUser);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
