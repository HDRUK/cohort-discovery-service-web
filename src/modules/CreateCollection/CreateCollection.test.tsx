// CreateCollection.test.tsx
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateCollection from "./CreateCollection";
import { Custodian, CollectionHost } from "@/types/api";
import getCustodian from "@/actions/__mocks__/getCustodian";
import { QueryContext } from "@/types/context";

const createCollection = jest.fn();

jest.mock("@/store/useDaphneStore", () => ({
  useDaphneStore: () => ({
    custodianData: {
      createCollection,
    },
  }),
}));

describe("CreateCollection", () => {
  let custodian: Custodian;
  let collectionHosts: CollectionHost[];

  beforeEach(() => {
    jest.clearAllMocks();
    custodian = getCustodian();
    collectionHosts = [
      { id: 10, name: "Alpha Host" } as unknown as CollectionHost,
      { id: 20, name: "Beta Host" } as unknown as CollectionHost,
    ];
  });

  it("renders the add button and shows the form when clicked", async () => {
    render(
      <CreateCollection
        custodian={custodian}
        collectionHosts={collectionHosts}
      />
    );

    const addBtn = screen.getByRole("button", { name: /collection/i });
    expect(addBtn).toBeEnabled();

    await userEvent.click(addBtn);

    expect(addBtn).toBeDisabled();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/query context type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/collection host/i)).toBeInTheDocument();

    expect(
      screen.getAllByText(new RegExp(QueryContext.BUNNY, "i"))[0]
    ).toBeInTheDocument();
  });

  it("shows validation errors when required fields are missing", async () => {
    render(
      <CreateCollection
        custodian={custodian}
        collectionHosts={collectionHosts}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /collection/i }));

    await userEvent.click(screen.getByRole("button", { name: /^create$/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/description is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/a collection host is required/i)
    ).toBeInTheDocument();

    expect(createCollection).not.toHaveBeenCalled();
  });

  it("lets the user change the Query Context Type", async () => {
    render(
      <CreateCollection
        custodian={custodian}
        collectionHosts={collectionHosts}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /collection/i }));

    const typeField = screen.getByLabelText(/query context type/i);
    await userEvent.click(typeField);

    const beaconOpt = await screen.findByRole("option", { name: /beacon/i });
    await userEvent.click(beaconOpt);

    expect(screen.getByText(/beacon/i)).toBeInTheDocument();
  });

  it("allows selecting a Collection Host", async () => {
    render(
      <CreateCollection
        custodian={custodian}
        collectionHosts={collectionHosts}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /collection/i }));

    const hostField = screen.getByLabelText(/collection host/i);
    await userEvent.click(hostField);

    const alphaOption = await screen.findByRole("option", {
      name: /alpha host/i,
    });
    await userEvent.click(alphaOption);
    expect(screen.getByLabelText(/alpha host/i)).toBeInTheDocument();
  });

  it("submits valid data and closes the form", async () => {
    render(
      <CreateCollection
        custodian={custodian}
        collectionHosts={collectionHosts}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /collection/i }));

    await userEvent.type(screen.getByLabelText(/name/i), "My Collection");
    await userEvent.type(
      screen.getByLabelText(/description/i),
      "A test collection"
    );

    const typeField = screen.getByLabelText(/query context type/i);
    await userEvent.click(typeField);
    await userEvent.click(
      await screen.findByRole("option", { name: /other/i })
    );

    const hostField = screen.getByLabelText(/collection host/i);
    await userEvent.click(hostField);
    await userEvent.click(
      await screen.findByRole("option", { name: /beta host/i })
    );

    createCollection.mockImplementation(async () => ({ ok: true }));

    const submitBtn = screen.getByRole("button", { name: /^create$/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(createCollection).toHaveBeenCalledTimes(1);
      expect(createCollection).toHaveBeenCalledWith(custodian.pid, {
        name: "My Collection",
        description: "A test collection",
        type: QueryContext.OTHER,
        host_id: 20,
      });
    });

    expect(
      screen.queryByRole("button", { name: /^create$/i })
    ).not.toBeInTheDocument();

    expect(screen.getByRole("button", { name: /collection/i })).toBeEnabled();
  });

  it("cancels and hides the form (and re-enables the add button)", async () => {
    render(
      <CreateCollection
        custodian={custodian}
        collectionHosts={collectionHosts}
      />
    );

    const addBtn = screen.getByRole("button", { name: /collection/i });
    await userEvent.click(addBtn);

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelBtn);

    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
    expect(addBtn).toBeEnabled();
  });
});
