import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("Should be able to get balance", async () => {
    const userData = {
      name: "User",
      email: "user@example.com",
      password: "amazing",
    };

    const user = await createUserUseCase.execute(userData);

    const { id } = user;

    const result = await getBalanceUseCase.execute({ user_id: id as string });

    expect(result).toHaveProperty("statement");
    expect(result).toHaveProperty("balance");
  });

  it("Should not be able to get balance if user does not exists", () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "randomid" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
