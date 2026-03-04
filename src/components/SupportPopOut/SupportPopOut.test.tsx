import SupportPopOut from "@/components/SupportPopOut";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("SupportPopOut", () => {
  it("should open support panel ", async () => {
    render(<SupportPopOut />);

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
