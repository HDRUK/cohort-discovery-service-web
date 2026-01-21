import "@testing-library/jest-dom";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateCollection from "./CreateCollection";
import { Custodian, CollectionHost, TaskType } from "@/types/api";
import getCustodian from "@/actions/__mocks__/getCustodian";
import { QueryContext } from "@/types/context";
import MockDaphneStore from "@/store/MockDaphneStore";

const createCollection = jest.fn();
let currentCustodian = {
  id: 123,
  pid: "1234-1234",
  name: "my name",
  external_custodian_id: 123,
  external_custodian_name: "yes",
};
const createCollectionAdmin = jest.fn();

let custodians: Custodian[];
let collectionHosts: CollectionHost[];

const renderCreateCollection = (
  overrides: Partial<Parameters<typeof CreateCollection>[0]> = {},
) => {
  return render(
    <MockDaphneStore
      overrides={{
        custodianData: {
          createCollection,
          currentCustodian,
        },
        adminData: { createCollection: createCollectionAdmin },
      }}
    >
      <CreateCollection
        custodians={custodians}
        collectionHosts={collectionHosts}
        {...overrides}
      />
    </MockDaphneStore>,
  );
};

describe("CreateCollection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    custodians = [getCustodian()];
    collectionHosts = [
      { id: 10, name: "Alpha Host" } as unknown as CollectionHost,
      { id: 20, name: "Beta Host" } as unknown as CollectionHost,
    ];
  });
  /*
  it("renders the main fields and sections", () => {
    renderCreateCollection();

    expect(screen.getByText(/new collection/i)).toBeInTheDocument();
    expect(screen.getByText(/collection configuration/i)).toBeInTheDocument();

    expect(screen.getByText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/description/i)).toBeInTheDocument();
    expect(
      screen.getByText(/link to associated datasets/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/query context type/i)).toBeInTheDocument();
    expect(screen.getByText(/collection host/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("does not submit when the form is invalid", async () => {
    const user = userEvent.setup();
    renderCreateCollection();

    const createButton = screen.getByRole("button", { name: /create/i });
    user.click(createButton);
    //to-do - add more testing for rendering form errors
    // - coming in a future maitenace ticket to clean up form handling

    await waitFor(() => {
      expect(createCollection).not.toHaveBeenCalled();
    });
  });
  */

  it("as a custodian, submits valid data, creates collection and config, and calls onCancel", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    const createdCollection = {
      id: 123,
      name: "My Collection",
    };

    createCollection.mockResolvedValue(createdCollection);

    renderCreateCollection({ onCancel });

    await user.type(screen.getByLabelText(/name/i), "My Collection");
    await user.type(screen.getByLabelText(/description/i), "A test collection");
    await user.type(
      screen.getByLabelText(/link to associated datasets/i),
      "http://example.com",
    );

    const label = screen.getByText(/collection host/i);
    const id = label.getAttribute("for");
    const hostSelect = document.getElementById(id!) as HTMLElement;

    await act(async () => {
      fireEvent.mouseDown(hostSelect);
    });

    const listbox = await screen.findByRole("listbox");
    const betaOption = within(listbox).getByText(/beta host/i);
    // note- having to use fireEvent - couldnt get this to work with user
    // with have to return to this one day?
    await act(async () => {
      fireEvent.click(betaOption);
    });

    const createButton = screen.getByRole("button", { name: /create/i });
    expect(createButton).not.toBeDisabled();
    await user.click(createButton);

    await waitFor(() => {
      expect(createCollection).toHaveBeenCalledTimes(1);
    });

    expect(createCollection).toHaveBeenCalledWith(
      "1234-1234",
      {
        name: "My Collection",
        description: "A test collection",
        url: "http://example.com",
        type: QueryContext.BUNNY,
        host_id: 20,
        custodian_id: "",
        status: true,
        pid: "mocked-uuid-17",
      },
      {
        collection_id: 0,
        enabled: 1,
        frequency_mode: 1,
        run_time_frequency: 0,
        run_time_hour: 0,
        run_time_minute: 0,
        type: TaskType.B,
      },
    );

    expect(onCancel).toHaveBeenCalled();
  });

  it("as an admin, submits valid data, creates collection and config, and calls onCancel", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    const createdCollection = {
      id: 123,
      name: "My Collection",
    };

    currentCustodian = undefined;
    createCollectionAdmin.mockResolvedValue(createdCollection);

    renderCreateCollection({ onCancel });

    const custodianLabel = screen.getByText(/custodian/i);
    const custodianId = custodianLabel.getAttribute("for");
    const custodianSelect = document.getElementById(
      custodianId!,
    ) as HTMLElement;

    await act(async () => {
      fireEvent.mouseDown(custodianSelect);
    });

    const custodianListbox = await screen.findByRole("listbox");
    const custodianOption = within(custodianListbox).getByText(
      custodians[0].name,
      { exact: false },
    );
    // note- having to use fireEvent - couldnt get this to work with user
    // with have to return to this one day?
    await act(async () => {
      fireEvent.click(custodianOption);
    });

    await user.type(screen.getByLabelText(/name/i), "My Collection");
    await user.type(screen.getByLabelText(/description/i), "A test collection");
    await user.type(
      screen.getByLabelText(/link to associated datasets/i),
      "http://example.com",
    );

    const label = screen.getByText(/collection host/i);
    const id = label.getAttribute("for");
    const hostSelect = document.getElementById(id!) as HTMLElement;

    await act(async () => {
      fireEvent.mouseDown(hostSelect);
    });

    const listbox = await screen.findByRole("listbox");
    const betaOption = within(listbox).getByText(/beta host/i);
    // note- having to use fireEvent - couldnt get this to work with user
    // with have to return to this one day?
    await act(async () => {
      fireEvent.click(betaOption);
    });

    const createButton = screen.getByRole("button", { name: /create/i });
    expect(createButton).not.toBeDisabled();
    await user.click(createButton);

    await waitFor(() => {
      expect(createCollectionAdmin).toHaveBeenCalledTimes(1);
    });

    expect(createCollectionAdmin).toHaveBeenCalledWith(
      {
        name: "My Collection",
        description: "A test collection",
        url: "http://example.com",
        type: QueryContext.BUNNY,
        host_id: 20,
        custodian_id: custodians[0].id,
        status: true,
        pid: "mocked-uuid-18",
      },
      {
        collection_id: 0,
        enabled: 1,
        frequency_mode: 1,
        run_time_frequency: 0,
        run_time_hour: 0,
        run_time_minute: 0,
        type: TaskType.B,
      },
    );
  });

  it("calls onCancel and resets the form when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    renderCreateCollection({ onCancel });

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const descInput = screen.getByLabelText(/description/i) as HTMLInputElement;
    const urlInput = screen.getByLabelText(
      /link to associated datasets/i,
    ) as HTMLInputElement;

    await user.type(nameInput, "Temp Name");
    await user.type(descInput, "Temp Description");
    await user.type(urlInput, "http://temp-url.com");

    const label = screen.getByText(/collection host/i);
    const id = label.getAttribute("for");
    const hostSelect = document.getElementById(id!) as HTMLElement;

    await act(async () => {
      fireEvent.mouseDown(hostSelect);
    });

    const listbox = await screen.findByRole("listbox");
    const betaOption = within(listbox).getByText(/alpha host/i);

    await act(async () => {
      fireEvent.click(betaOption);
    });

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();

    // RHF reset should clear values
    expect(nameInput.value).toBe("");
    expect(descInput.value).toBe("");
    expect(urlInput.value).toBe("");
  });
});
