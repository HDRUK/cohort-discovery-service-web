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
import { DaphneStoreState, useDaphneStore } from "@/store/useDaphneStore";
import MockDaphneStore from "@/store/MockDaphneStore";
import { getMockCollection } from "@/actions/__mocks__/getCollections";
import getCollectionHost from "@/actions/__mocks__/getCollectionHost";
jest.mock("@/actions/getCustodian");

const createCollection = jest.fn();
const mockCustodian = getCustodian();
const createCollectionAdmin = jest.fn();

let custodians: Custodian[];
let collectionHosts: CollectionHost[];

const renderCreateCollection = (
  overrides: Partial<Parameters<typeof CreateCollection>[0]> = {},
  custodianDataOverides = {},
) => {
  return render(
    <MockDaphneStore
      overrides={{
        custodianData: {
          createCollection,
          currentCustodian: mockCustodian,
          ...custodianDataOverides,
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
    createCollection.mockImplementation(
      async (_custodianPid, collection, _config) => {
        return getMockCollection({
          id: 123,
          ...collection,
        });
      },
    );
    custodians = [mockCustodian];
    collectionHosts = [
      getCollectionHost({
        id: 10,
        name: "Alpha Host",
        custodian: mockCustodian,
      }),
      getCollectionHost({
        id: 20,
        name: "Beta Host",
        custodian: mockCustodian,
      }),
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

    renderCreateCollection({ onCancel });

    let nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    expect(nameInput).toBeDisabled();

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    const label = screen.getByText(/collection host/i);
    const id = label.getAttribute("for");
    const hostSelect = document.getElementById(id!) as HTMLElement;

    await act(async () => {
      fireEvent.mouseDown(hostSelect);
    });

    nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    expect(nameInput).toBeDisabled();

    const listbox = await screen.findByRole("listbox");
    expect(listbox).toBeInTheDocument();

    const betaOption = within(listbox).getByText(/beta host/i);
    // note- having to use fireEvent - couldnt get this to work with user
    // with have to return to this one day?
    await act(async () => {
      fireEvent.click(betaOption);
    });

    nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    await user.type(nameInput, "My Collection");
    expect(nameInput).toHaveValue("My Collection");

    const descInput = screen.getByLabelText(/description/i) as HTMLInputElement;
    await user.type(descInput, "A test collection");
    expect(descInput).toHaveValue("A test collection");

    const urlInput = screen.getByLabelText(
      /link to associated datasets/i,
    ) as HTMLInputElement;
    await user.type(urlInput, "http://example.com");
    expect(urlInput).toHaveValue("http://example.com");

    const createButton = screen.getByRole("button", { name: /create/i });
    expect(createButton).not.toBeDisabled();
    await user.click(createButton);

    await waitFor(() => {
      expect(createCollection).toHaveBeenCalledTimes(1);
    });

    const [_pid, payload, _config] = createCollection.mock.calls[0];
    expect(payload.name).toBe("My Collection");
    expect(payload.url).toBe("http://example.com");

    expect(onCancel).toHaveBeenCalled();
  });

  it("as an admin, submits valid data, creates collection and config, and calls onCancel", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    renderCreateCollection({ onCancel }, { currentCustodian: null });

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

    await act(async () => {
      fireEvent.click(custodianOption);
    });

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

    await user.type(screen.getByLabelText(/name/i), "My Admin Collection");
    await user.type(screen.getByLabelText(/description/i), "A test collection");
    await user.type(
      screen.getByLabelText(/link to associated datasets/i),
      "http://example.com",
    );

    const createButton = screen.getByRole("button", { name: /create/i });
    expect(createButton).not.toBeDisabled();
    await user.click(createButton);

    await waitFor(() => {
      expect(createCollection).toHaveBeenCalledTimes(1);
    });

    const [_pid, payload, _config] = createCollection.mock.calls[0];
    expect(payload.name).toBe("My Admin Collection");
    expect(payload.url).toBe("http://example.com");

    expect(onCancel).toHaveBeenCalled();
  });

  it("calls onCancel and resets the form when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    renderCreateCollection({ onCancel });

    const label = screen.getByText(/collection host/i);
    const id = label.getAttribute("for");
    const hostSelect = document.getElementById(id!) as HTMLElement;

    await act(async () => {
      fireEvent.mouseDown(hostSelect);
    });

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const descInput = screen.getByLabelText(/description/i) as HTMLInputElement;
    const urlInput = screen.getByLabelText(
      /link to associated datasets/i,
    ) as HTMLInputElement;

    await user.type(nameInput, "Temp Name");
    await user.type(descInput, "Temp Description");
    await user.type(urlInput, "http://temp-url.com");

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
