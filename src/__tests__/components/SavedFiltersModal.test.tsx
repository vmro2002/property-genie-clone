import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SavedFiltersModal from "@/components/SavedFiltersModal/SavedFiltersModal";
import type { ListingFilter } from "@/utils/types";

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onDelete: jest.fn(),
  onApply: jest.fn(),
};

describe("SavedFiltersModal", () => {
  describe("empty state", () => {
    it("shows the empty state message when isEmpty is true", () => {
      render(
        <SavedFiltersModal
          {...defaultProps}
          savedItems={[]}
          isEmpty={true}
        />
      );
      expect(screen.getByText(/no saved searches yet/i)).toBeInTheDocument();
    });

    it("does not render any list items in the empty state", () => {
      render(
        <SavedFiltersModal
          {...defaultProps}
          savedItems={[]}
          isEmpty={true}
        />
      );
      // No delete buttons should be present
      expect(screen.queryByLabelText(/delete saved search/i)).not.toBeInTheDocument();
    });
  });

  describe("populated state", () => {
    const savedItems: ListingFilter[] = [
      { id: "filter-1", section: "rent", state: "Selangor" },
      { id: "filter-2", section: "sale", categories: "residential" },
    ];

    it("renders an item for each saved filter", () => {
      render(
        <SavedFiltersModal
          {...defaultProps}
          savedItems={savedItems}
          isEmpty={false}
        />
      );
      // Each filter shows the formatted primary text
      expect(screen.getByText("Rent • Selangor")).toBeInTheDocument();
      expect(screen.getByText("Sale")).toBeInTheDocument();
    });

    it("renders a delete button for each item", () => {
      render(
        <SavedFiltersModal
          {...defaultProps}
          savedItems={savedItems}
          isEmpty={false}
        />
      );
      const deleteButtons = screen.getAllByLabelText(/delete saved search/i);
      expect(deleteButtons).toHaveLength(2);
    });

    it("calls onDelete with the correct filterId when the delete button is clicked", async () => {
      const user = userEvent.setup();
      const onDelete = jest.fn();

      render(
        <SavedFiltersModal
          {...defaultProps}
          savedItems={savedItems}
          isEmpty={false}
          onDelete={onDelete}
        />
      );

      const deleteButtons = screen.getAllByLabelText(/delete saved search/i);
      await user.click(deleteButtons[0]);

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith("filter-1");
    });

    it("calls onApply with the correct filterId when a filter item is clicked", async () => {
      const user = userEvent.setup();
      const onApply = jest.fn();

      render(
        <SavedFiltersModal
          {...defaultProps}
          savedItems={savedItems}
          isEmpty={false}
          onApply={onApply}
        />
      );

      // Click the first filter's primary text (the list item button)
      await user.click(screen.getByText("Rent • Selangor"));

      expect(onApply).toHaveBeenCalledTimes(1);
      expect(onApply).toHaveBeenCalledWith("filter-1");
    });
  });

  describe("close button", () => {
    it("calls onClose when the Close button in the footer is clicked", async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();

      render(
        <SavedFiltersModal
          {...defaultProps}
          savedItems={[]}
          isEmpty={true}
          onClose={onClose}
        />
      );

      // The footer text button has visible text "Close"; use getByText to avoid
      // matching the icon button which also carries aria-label="Close"
      await user.click(screen.getByText("Close"));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when the X icon button in the header is clicked", async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();

      render(
        <SavedFiltersModal
          {...defaultProps}
          savedItems={[]}
          isEmpty={true}
          onClose={onClose}
        />
      );

      await user.click(screen.getByLabelText(/^close$/i));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
