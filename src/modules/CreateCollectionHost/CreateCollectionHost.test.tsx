import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateCollectionHost from "./CreateCollectionHost";
import { Custodian } from "@/types/api";
import getCustodian from "@/actions/__mocks__/getCustodian";

// --- Mock Daphne store ---
const createCollectionHost = jest.fn();
const onCancel = jest.fn();

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
) =>
  render(
    <CreateCollectionHost
      custodianId={custodian.id}
      onCancel={onCancel}
      {...overrides}
    />
  );

describe("CreateCollectionHost", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    custodian = getCustodian();
  });

  it("renders the form ", async () => {
    renderCreateColllectionHost();
    expect(screen.getByText(/name/i)).toBeInTheDocument();
  });

  it("disables Create button if name is empty", () => {
    renderCreateColllectionHost();

    const button = screen.getByRole("button", { name: /^create$/i });
    expect(button).toBeDisabled();
  });

  it("submits valid data", async () => {
    renderCreateColllectionHost();

    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.type(nameInput, "My Host");

    createCollectionHost.mockImplementation(async () => {
      return { ok: true };
    });

    const submitBtn = screen.getByRole("button", { name: /^create$/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(createCollectionHost).toHaveBeenCalledTimes(1);
      expect(createCollectionHost).toHaveBeenCalledWith(custodian.id, {
        name: "My Host",
        context: "bunny",
      });
    });
  });

  it("cancels and hides the form (and re-enables the add button)", async () => {
    renderCreateColllectionHost();

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelBtn);

    await waitFor(() => {
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });
});
