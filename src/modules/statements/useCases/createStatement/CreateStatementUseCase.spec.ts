import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to make deposit", async () => {
    const userData = {
      name: "User",
      email: "user@example.com",
      password: "amazing",
    };

    await createUserUseCase.execute(userData);

    const authenticationResponse = await authenticateUserUseCase.execute(
      userData
    );

    const { id: user_id } = authenticationResponse.user;

    await createStatementUseCase.execute({
      user_id: user_id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Test deposit",
    });
  });

  it("Should be able to make withdraw", async () => {
    const userData = {
      name: "User",
      email: "user@example.com",
      password: "amazing",
    };

    await createUserUseCase.execute(userData);

    const authenticationResponse = await authenticateUserUseCase.execute(
      userData
    );

    const { id: user_id } = authenticationResponse.user;

    await createStatementUseCase.execute({
      user_id: user_id as string,
      type: OperationType.DEPOSIT,
      amount: 250,
      description: "Test deposit",
    });

    await createStatementUseCase.execute({
      user_id: user_id as string,
      type: OperationType.WITHDRAW,
      amount: 100,
      description: "Test withdraw",
    });
  });

  it("Should not be able to create statement if user does not exists", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "321",
        type: OperationType.DEPOSIT,
        amount: 350,
        description: "Test deposit",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should not be able to make a withdrawal if there are not enough funds", () => {
    expect(async () => {
      const userData = {
        name: "User",
        email: "user@example.com",
        password: "amazing",
      };

      await createUserUseCase.execute(userData);

      const authenticationResponse = await authenticateUserUseCase.execute(
        userData
      );

      const { id: user_id } = authenticationResponse.user;

      await createStatementUseCase.execute({
        user_id: user_id as string,
        type: OperationType.DEPOSIT,
        amount: 500,
        description: "Test deposit",
      });

      await createStatementUseCase.execute({
        user_id: user_id as string,
        type: OperationType.WITHDRAW,
        amount: 1000,
        description: "Test withdraw",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
