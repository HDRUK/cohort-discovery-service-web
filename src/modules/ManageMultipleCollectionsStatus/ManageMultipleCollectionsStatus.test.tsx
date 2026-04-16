import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ManageMultipleCollectionsStatus from "./ManageMultipleCollectionsStatus";
import {
  Collection,
  CollectionStatus,
  FrequencyMode,
  UrlString,
} from "@/types/api";
import { NotifyProvider } from "@/providers/NotifyProvider";
import { FormProvider, useForm } from "react-hook-form";
import { UpdateCollectionFormValues } from "@/types/forms";
import ConfirmProvider from "@/components/ConfirmProvider";

function TestHarness({ mockCollections }: { mockCollections: Collection[] }) {
  const formMethods = useForm<UpdateCollectionFormValues>({
    defaultValues: {
      collection: {
        name: "",
        description: "",
        url: "" as UrlString,
        host_id: 0,
        model_state: undefined,
      },
      config: {
        frequency_mode: Number(FrequencyMode.WEEKLY),
        run_time_frequency: 0,
        run_time_hour: 0,
        run_time_minute: 0,
      },
    },
  });

  return (
    <NotifyProvider>
      <ConfirmProvider>
        <FormProvider {...formMethods}>
          <ManageMultipleCollectionsStatus
            collections={mockCollections}
            expandedRight={true}
          />
        </FormProvider>
      </ConfirmProvider>
    </NotifyProvider>
  );
}

describe("ManageCollectionStatus", () => {
  function mockCollections(initialStatuses: CollectionStatus[]) {
    return initialStatuses.map((initialStatus, index) => {
      return {
        id: index + 1,
        title: "Test Collection",
        model_state: {
          id: initialStatus,
          state_id: initialStatus,
          state: {
            id: initialStatus,
            name: CollectionStatus[initialStatus],
            slug: CollectionStatus[initialStatus].toLowerCase(),
          },
        },
      } as unknown as Collection;
    });
  }

  const renderComponent = (initialStatuses: CollectionStatus[]) => {
    render(<TestHarness mockCollections={mockCollections(initialStatuses)} />);
  };

  it("renders the component in draft with correct initial status", () => {
    renderComponent([CollectionStatus.DRAFT, CollectionStatus.DRAFT]);
    expect(screen.queryByText(/Draft/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Pending/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Active/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Rejected/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Offline/i)).not.toBeInTheDocument();
    expect(screen.getByText("Request to make active")).toBeInTheDocument();
  });

  it("renders the component in pending with correct initial status", () => {
    renderComponent([CollectionStatus.PENDING, CollectionStatus.PENDING]);
    expect(screen.queryByText(/Draft/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Pending/i)).toBeInTheDocument();
    expect(screen.queryByText(/Active/i)).toBeInTheDocument();
    expect(screen.queryByText(/Rejected/i)).toBeInTheDocument();
    expect(screen.queryByText(/Offline/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText("Request to make active"),
    ).not.toBeInTheDocument();
  });

  it("renders the component in active with correct initial status", () => {
    renderComponent([CollectionStatus.ACTIVE, CollectionStatus.ACTIVE]);
    expect(screen.queryByText(/Draft/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Pending/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Active/)).toBeInTheDocument();
    expect(screen.queryByText(/Inactive/i)).toBeInTheDocument();
    expect(screen.queryByText(/Rejected/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Offline/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText("Request to make active"),
    ).not.toBeInTheDocument();
  });

  it("renders the component in REJECTED with correct initial status", () => {
    renderComponent([CollectionStatus.REJECTED, CollectionStatus.REJECTED]);
    expect(screen.queryByText(/Draft/i)).toBeInTheDocument();
    expect(screen.queryByText(/Pending/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Active/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Inactive/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Rejected/i)).toBeInTheDocument();
    expect(screen.queryByText(/Offline/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText("Request to make active"),
    ).not.toBeInTheDocument();
  });

  it("renders the component in SUSPENDED with correct initial status", () => {
    renderComponent([CollectionStatus.SUSPENDED, CollectionStatus.SUSPENDED]);
    expect(screen.queryByText(/Draft/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Pending/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Active/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Inactive/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Rejected/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Offline/i)).toBeInTheDocument();
    expect(
      screen.queryByText("Request to make active"),
    ).not.toBeInTheDocument();
  });

  it("renders the component in a mixed status with correct initial status", () => {
    renderComponent([CollectionStatus.ACTIVE, CollectionStatus.REJECTED]);
    expect(screen.queryByText(/Draft/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Pending/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Active/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Inactive/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Rejected/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Offline/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Mixed/i)).toBeInTheDocument();
    expect(
      screen.queryByText("Request to make active"),
    ).not.toBeInTheDocument();
  });
});
