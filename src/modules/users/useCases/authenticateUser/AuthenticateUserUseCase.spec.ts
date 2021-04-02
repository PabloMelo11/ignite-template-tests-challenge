import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to authenticate user", async () => {
    const user = {
      name: "john",
      email: "john@test.com.br",
      password: "123456",
    };

    const userCreated = await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result.user).toMatchObject({
      id: userCreated.id,
      name: userCreated.name,
      email: userCreated.email,
    });

    expect(result).toHaveProperty("token");
  });
});
