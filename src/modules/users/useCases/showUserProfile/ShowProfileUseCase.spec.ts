import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to show profile", async () => {
    const user = await createUserUseCase.execute({
      name: "john",
      email: "john@test.com.br",
      password: "123456",
    });

    const profile = await showUserProfileUseCase.execute(user.id!);

    expect(profile).toEqual(user);
  });
});
