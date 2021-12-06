import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to authenticate user", async () => {
    const user = {
      name: "User 1",
      email: "user1@example.com",
      password: "amazing",
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute(user);

    expect(result).toHaveProperty("user");
    expect(result).toHaveProperty("token");
  });

  it("Should not be able to authenticate user if credentials not match", () => {
    expect(async () => {
      const user = {
        name: "Incorrect user",
        email: "incorrect@example.com",
        password: "amazing",
      };

      await createUserUseCase.execute(user);

      const { email } = user;

      await authenticateUserUseCase.execute({
        email,
        password: "beautiful",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
