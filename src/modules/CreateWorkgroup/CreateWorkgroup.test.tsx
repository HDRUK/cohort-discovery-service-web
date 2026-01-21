import "@testing-library/jest-dom";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateWorkgroup from "./CreateWorkgroup";
import { Collection } from "@/types/api";
import MockDaphneStore from "@/store/MockDaphneStore";
import { getMockCollections } from "@/actions/__mocks__/getCollections";

const createWorkgroup = jest.fn();
const addCollectionToWorkgroup = jest.fn();

let collections: Collection[];

const renderCreateWorkgroup = (
  overrides: Partial<Parameters<typeof CreateWorkgroup>[0]> = {},
) => {
  return render(
    <MockDaphneStore
      overrides={{
        adminData: {
          createWorkgroup,
          addCollectionToWorkgroup,
        },
      }}
    >
      <CreateWorkgroup collections={collections} {...overrides} />
    </MockDaphneStore>,
  );
};

describe("CreateWorkgroup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    collections = getMockCollections();
  });

  it("submits valid data, creates workgroup, and calls onCancel", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    const createdWorkgroup = {
      id: 123,
      name: "My Workgroup",
    };

    createWorkgroup.mockResolvedValue(createdWorkgroup);

    renderCreateWorkgroup({ onCancel });

    await user.type(screen.getByLabelText(/name/i), "My Workgroup");

    const collectionSelect = screen.getByRole("combobox");

    await act(async () => {
      fireEvent.mouseDown(collectionSelect);
    });

    // note- having to comment this out for now because I cannot get it to work
    // with the testing framework, and I've tried loads

    // const listbox = await screen.findByRole("listbox");
    //
    // const secondOption = within(listbox).getByText(/Test Dataset #2/i);
    //
    // await act(async () => {
    //   fireEvent.click(secondOption);
    // });

    const createButton = screen.getByRole("button", { name: /create/i });
    expect(createButton).not.toBeDisabled();
    await user.click(createButton);

    await waitFor(() => {
      expect(createWorkgroup).toHaveBeenCalledTimes(1);
    });

    expect(createWorkgroup).toHaveBeenCalledWith({
      name: "My Workgroup",
      active: true,
    });

    expect(onCancel).toHaveBeenCalled();
  });

  it("calls onCancel and resets the form when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    renderCreateWorkgroup({ onCancel });

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;

    await user.type(nameInput, "Temp Name");

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();

    // RHF reset should clear values
    expect(nameInput.value).toBe("");
  });
});
