import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterOptionToggle from "@/components/FilterModal/FilterOptionToggle";

describe("FilterOptionToggle", () => {
  it("renders the label", () => {
    render(
      <FilterOptionToggle
        label="2 Bedrooms"
        value={2}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText("2 Bedrooms")).toBeInTheDocument();
  });

  it("calls onClick with the correct value when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <FilterOptionToggle
        label="Fully Furnished"
        value="fully-furnished"
        isSelected={false}
        onClick={handleClick}
      />
    );

    await user.click(screen.getByText("Fully Furnished"));

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith("fully-furnished");
  });

  it("calls onClick with a numeric value for bedroom/bathroom toggles", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <FilterOptionToggle
        label="3"
        value={3}
        isSelected={true}
        onClick={handleClick}
      />
    );

    await user.click(screen.getByText("3"));

    expect(handleClick).toHaveBeenCalledWith(3);
  });

  it("renders without crashing in both selected and unselected states", () => {
    const { rerender } = render(
      <FilterOptionToggle
        label="Studio"
        value={0}
        isSelected={false}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText("Studio")).toBeInTheDocument();

    rerender(
      <FilterOptionToggle
        label="Studio"
        value={0}
        isSelected={true}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByText("Studio")).toBeInTheDocument();
  });
});
