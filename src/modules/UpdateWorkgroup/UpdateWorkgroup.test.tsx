import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpdateWorkgroup from ".";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { ThreePaneProvider } from "@/providers/ThreePaneProvider";
import { CloseGuardProvider } from "@/providers/CloseGuardProvider";
import SwimLane from "@/components/SwimLane";
import updateWorkgroupMembers from "@/actions/workgroup/updateWorkgroupMembers";
import { useSelectionStore } from "@/store/selectionStore";
import { getMockCollection } from "@/test/fixtures/collections";
import {
  getMockAccessPolicy,
  getMockAdminUser,
  getMockMembershipSource,
  getMockMembershipSources,
  getMockSubjectPolicy,
} from "@/test/fixtures/accessPolicy";
import { MembershipMode } from "@/types/accessPolicy";

jest.mock("@/actions/workgroup/updateWorkgroupMembers", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const updateWorkgroupMembersMock =
  updateWorkgroupMembers as jest.MockedFunction<typeof updateWorkgroupMembers>;

const COLLECTION = getMockCollection({ id: 1, name: "Mock Collection #1" });
const COLLECTION_PLACEHOLDER = "Search and add approved collections...";

const MANAGED_USER = getMockAdminUser({
  id: 42,
  membership_sources: getMockMembershipSources({
    workgroups: getMockMembershipSource({
      mode: MembershipMode.Authoritative,
      editable: false,
      sources: ["default"],
    }),
  }),
});

const AUTHORITATIVE_POLICY = getMockAccessPolicy({
  workgroups: getMockSubjectPolicy({
    mode: MembershipMode.Authoritative,
    authoritative: true,
    editable: false,
  }),
});

const renderComponent = () =>
  render(
    <MockCohortDiscoveryServiceStore
      overrides={{
        session: { workgroups: [{ id: 2, name: "WG_ONE" }] },
        adminSection: {
          collections: [COLLECTION],
          users: [MANAGED_USER],
          accessPolicy: AUTHORITATIVE_POLICY,
        },
      }}
    >
      <ThreePaneProvider>
        <SwimLane> Another Area </SwimLane>
        <SwimLane enableBlocker>
          <CloseGuardProvider>
            <UpdateWorkgroup />
          </CloseGuardProvider>
        </SwimLane>
      </ThreePaneProvider>
    </MockCohortDiscoveryServiceStore>,
  );

const pickCollection = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByPlaceholderText(COLLECTION_PLACEHOLDER));
  await user.click(
    await screen.findByRole("option", { name: COLLECTION.name }),
  );
};

describe("UpdateWorkgroup", () => {
  beforeEach(() => {
    updateWorkgroupMembersMock.mockReset();
  });

  it("clears the picks once a retry after a partial failure succeeds", async () => {
    updateWorkgroupMembersMock
      .mockResolvedValueOnce({
        failed: [],
        failedCollections: [{ id: COLLECTION.id, message: "Refused" }],
      })
      .mockResolvedValueOnce({ failed: [], failedCollections: [] });
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId("edit-panel-toggle"));
    await pickCollection(user);
    await user.click(screen.getByTestId("save-panel-toggle"));
    await user.click(screen.getByTestId("save-panel-toggle"));

    expect(updateWorkgroupMembersMock).toHaveBeenCalledTimes(2);

    await user.click(screen.getByTestId("edit-panel-toggle"));
    await user.click(screen.getByTestId("save-panel-toggle"));

    expect(updateWorkgroupMembersMock).toHaveBeenCalledTimes(2);
  });

  it("lets collections be added while a managed user is ticked for removal", async () => {
    const user = userEvent.setup();
    renderComponent();

    act(() => {
      useSelectionStore.setState({
        selectedUserIds: [String(MANAGED_USER.id)],
      });
    });
    await user.click(screen.getByTestId("edit-panel-toggle"));

    expect(screen.getByPlaceholderText(COLLECTION_PLACEHOLDER)).toBeEnabled();
  });
});
