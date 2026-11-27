import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import CustodianTable from "./CustodianTable";
import { getMockCustodian } from "@/test/fixtures/custodians";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { paginateData } from "@/utils/mock";

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/admin/networks",
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

const NETWORK_A_CUSTODIANS = paginateData({
  data: [{ ...getMockCustodian(), id: 1, name: "Custodian A" }],
});
const NETWORK_B_CUSTODIANS = paginateData({
  data: [{ ...getMockCustodian(), id: 2, name: "Custodian B" }],
});

const deleteButton = () => screen.getByTestId("DeleteIcon").closest("button");

const renderTable = (
  custodians: typeof NETWORK_A_CUSTODIANS,
  onDelete: (ids: string[]) => Promise<boolean>,
) => (
  <MockCohortDiscoveryServiceStore>
    <CustodianTable custodians={custodians} onDelete={onDelete} />
  </MockCohortDiscoveryServiceStore>
);

describe("CustodianTable", () => {
  it("clears the selection when the custodians change", () => {
    const onDelete = jest.fn().mockResolvedValue(true);
    const { rerender } = render(renderTable(NETWORK_A_CUSTODIANS, onDelete));

    fireEvent.click(
      screen.getByRole("checkbox", { name: /toggle select row/i }),
    );
    expect(deleteButton()).toBeEnabled();

    rerender(renderTable(NETWORK_B_CUSTODIANS, onDelete));

    expect(screen.getByText("Custodian B")).toBeInTheDocument();
    expect(deleteButton()).toBeDisabled();
  });
});
