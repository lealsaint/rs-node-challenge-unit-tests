import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to get statement operation by id", async () => {
    const userData = {
      name: "User",
      email: "user@example.com",
      password: "amazing",
    };

    const user = await createUserUseCase.execute(userData);
    const { id: user_id } = user;

    const statement = await createStatementUseCase.execute({
      user_id: user_id as string,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: "Mega deposit",
    });

    const { id: statement_id } = statement;

    const result = await getStatementOperationUseCase.execute({
      user_id: user_id as string,
      statement_id: statement_id as string,
    });

    expect(result).toHaveProperty("id");
  });

  it("Should not be able to get statement operation by id if user does not exists", async () => {
    expect(async () => {
      const userData = {
        name: "User",
        email: "user@example.com",
        password: "amazing",
      };

      const user = await createUserUseCase.execute(userData);
      const { id: user_id } = user;

      const statement = await createStatementUseCase.execute({
        user_id: user_id as string,
        type: OperationType.DEPOSIT,
        amount: 500,
        description: "Mega deposit",
      });

      const { id: statement_id } = statement;

      await getStatementOperationUseCase.execute({
        user_id: "randomuserid",
        statement_id: statement_id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not be able to get statement operation by id if statement does not exists", async () => {
    expect(async () => {
      const userData = {
        name: "User",
        email: "user@example.com",
        password: "amazing",
      };

      const user = await createUserUseCase.execute(userData);
      const { id: user_id } = user;

      await createStatementUseCase.execute({
        user_id: user_id as string,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "Simple withdraw",
      });

      await getStatementOperationUseCase.execute({
        user_id: user_id as string,
        statement_id: "randomstatementid",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
