import SupportPopOut from "@/components/SupportPopOut";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DefaultProvider } from "@/providers/DefaultProvider";
import ApplicationModeProvider from "@/providers/ApplicationModeProvider";

describe("SupportPopOut", () => {
  it("should open support panel ", async () => {
    render(
      <DefaultProvider>
        <ApplicationModeProvider>
          <SupportPopOut />
        </ApplicationModeProvider>
      </DefaultProvider>,
    );

    const button = screen.getByText("Need support?");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Visit Support Centre")).toBeInTheDocument();
      expect(screen.getByText("Share feedback")).toBeInTheDocument();
      expect(
        screen.getByText("Get Help / Report an Issue"),
      ).toBeInTheDocument();
    });
  });
});
