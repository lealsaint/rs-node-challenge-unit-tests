import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to show user profile", async () => {
    const testUser = await createUserUseCase.execute({
      name: "User Top",
      email: "user@example.com",
      password: "amazing",
    });

    const { id: user_id } = testUser;

    const user = await showUserProfileUseCase.execute(user_id as string);

    expect(testUser).toHaveProperty("id");
    expect(user).toBeInstanceOf(User);
  });

  it("Should not be able to show user profile if user id does not exists", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User Top",
        email: "user@example.com",
        password: "amazing",
      });

      const user_id = "321";

      await showUserProfileUseCase.execute(user_id);
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
