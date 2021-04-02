import { OperationType } from "../../entities/Statement";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementRepository
    );

    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to get balance", async () => {
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

    const getBalance = await getBalanceUseCase.execute({
      user_id: user.id!,
    });

    expect(getBalance.statement[0]).toEqual(statement);
    expect(getBalance.statement.length).toBe(1);
    expect(getBalance.balance).toBe(10);
  });
});
