import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

import { OperationType } from "../../entities/Statement";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a new DEPOSIT", async () => {
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

    expect(statement).toHaveProperty("id");
    expect(statement.user_id).toEqual(user.id);
  });

  it("should be able to create a new WITHDRAW", async () => {
    const user = await createUserUseCase.execute({
      name: "john",
      email: "john@test.com.br",
      password: "123456",
    });

    await createStatementUseCase.execute({
      user_id: user.id!,
      amount: 20,
      description: "new deposit",
      type: OperationType.DEPOSIT,
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      amount: 10,
      description: "new withdraw",
      type: OperationType.WITHDRAW,
    });

    expect(statement).toHaveProperty("id");
    expect(statement.user_id).toEqual(user.id);
  });
});
