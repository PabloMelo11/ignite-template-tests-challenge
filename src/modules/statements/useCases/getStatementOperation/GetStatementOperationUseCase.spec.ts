import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

import { OperationType } from "../../entities/Statement";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Create statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

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

  it("should be able to get statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "john",
      email: "john@test.com.br",
      password: "123456",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      amount: 10,
      description: "new deposit",
      type: OperationType.DEPOSIT,
    });

    const getStatement = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: statement.id!,
    });

    expect(getStatement).toEqual(statement);
  });
});
