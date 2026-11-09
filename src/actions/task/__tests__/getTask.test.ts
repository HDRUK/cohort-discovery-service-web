import { getTask as readTask } from "@/server/data/tasks";
import getTask from "../getTask";

jest.mock("@/server/data/tasks", () => ({
  getTask: jest.fn(),
}));

const mockedReadTask = readTask as jest.MockedFunction<typeof readTask>;

beforeEach(() => mockedReadTask.mockReset());

describe("getTask", () => {
  it("passes only the pid to the data layer", async () => {
    const hostileArgs = {
      url: "https://attacker.example.com",
      options: { headers: { Authorization: "Bearer stolen" } },
    };

    await (getTask as (pid: string, args: unknown) => Promise<unknown>)(
      "task-pid",
      hostileArgs,
    );

    expect(mockedReadTask).toHaveBeenCalledWith("task-pid");
  });
});
