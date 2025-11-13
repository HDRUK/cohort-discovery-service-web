import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateCollectionHost from "./CreateCollectionHost";
import { Custodian } from "@/types/api";
import getCustodian from "@/actions/__mocks__/getCustodian";

// --- Mock Daphne store ---
const createCollectionHost = jest.fn();

jest.mock("@/store/useDaphneStore", () => ({
  useDaphneStore: () => ({
    custodianData: {
      createCollectionHost,
    },
  }),
}));

let custodian: Custodian;

const renderCreateColllectionHost = (
  overrides: Partial<React.ComponentProps<typeof CreateCollectionHost>> = {}
) => render(<CreateCollectionHost custodian={custodian} {...overrides} />);

describe("CreateCollectionHost", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    custodian = getCustodian();
  });

  it("renders the add button and shows the form when clicked", async () => {
    renderCreateColllectionHost();

    const addBtn = screen.getByRole("button", { name: /collection host/i });
    expect(addBtn).toBeEnabled();

    await userEvent.click(addBtn);

    expect(addBtn).toBeDisabled();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/query context type/i)).toBeInTheDocument();

    expect(screen.getAllByText(/bunny/i)[0]).toBeInTheDocument();
  });

  it("shows a validation error if name is empty on submit", async () => {
    renderCreateColllectionHost();

    await userEvent.click(
      screen.getByRole("button", { name: /collection host/i })
    );

    await userEvent.click(screen.getByRole("button", { name: /^create$/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(createCollectionHost).not.toHaveBeenCalled();
  });

  it("lets the user change the Query Context Type", async () => {
    renderCreateColllectionHost();

    await userEvent.click(
      screen.getByRole("button", { name: /collection host/i })
    );

    const contextField = screen.getByLabelText(/query context type/i);

    await userEvent.click(contextField);

    const option = await screen.findByRole("option", { name: /beacon/i });
    await userEvent.click(option);

    expect(screen.getByText(/beacon/i)).toBeInTheDocument();
  });

  it("submits valid data and closes the form", async () => {
    render(<CreateCollectionHost custodian={custodian} />);

    await userEvent.click(
      screen.getByRole("button", { name: /collection host/i })
    );

    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.type(nameInput, "My Host");

    const contextField = screen.getByLabelText(/query context type/i);
    await userEvent.click(contextField);
    await userEvent.click(
      await screen.findByRole("option", { name: /other/i })
    );

    createCollectionHost.mockImplementation(async () => {
      return { ok: true };
    });

    const submitBtn = screen.getByRole("button", { name: /^create$/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(createCollectionHost).toHaveBeenCalledTimes(1);
      expect(createCollectionHost).toHaveBeenCalledWith(custodian.id, {
        name: "My Host",
        context: "other",
      });
    });

    expect(
      screen.queryByRole("button", { name: /^create$/i })
    ).not.toBeInTheDocument();
  });

  it("cancels and hides the form (and re-enables the add button)", async () => {
    renderCreateColllectionHost();

    const addBtn = screen.getByRole("button", { name: /collection host/i });
    await userEvent.click(addBtn);

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelBtn);

    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
    expect(addBtn).toBeEnabled();
  });
});
