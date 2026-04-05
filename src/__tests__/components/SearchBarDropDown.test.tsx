import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBarDropDown from "@/components/SearchBar/SearchBarDropDown";
import type { SearchLocation } from "@/utils/types";

const noop = () => {};

describe("SearchBarDropDown", () => {
  it("shows a 'start typing' prompt when hasKeyword is false", () => {
    render(
      <SearchBarDropDown
        hasKeyword={false}
        locationsIsFetching={false}
        locationsError={null}
        locations={undefined}
        onLocationClick={noop}
      />
    );
    expect(screen.getByText(/start typing to search/i)).toBeInTheDocument();
  });

  it("shows a loading spinner while fetching and hasKeyword is true", () => {
    render(
      <SearchBarDropDown
        hasKeyword={true}
        locationsIsFetching={true}
        locationsError={null}
        locations={undefined}
        onLocationClick={noop}
      />
    );
    // CircularProgress renders an svg with role="progressbar"
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("shows an error message when locationsError is set", () => {
    render(
      <SearchBarDropDown
        hasKeyword={true}
        locationsIsFetching={false}
        locationsError={new Error("Network error")}
        locations={undefined}
        onLocationClick={noop}
      />
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("shows 'No results found' when hasKeyword is true but locations is empty", () => {
    render(
      <SearchBarDropDown
        hasKeyword={true}
        locationsIsFetching={false}
        locationsError={null}
        locations={[]}
        onLocationClick={noop}
      />
    );
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it("renders each location item with its title and type chip", () => {
    const locations: SearchLocation[] = [
      { type: "State", title: "Selangor", slug: "selangor" },
      { type: "City", title: "Kuala Lumpur", slug: "kuala-lumpur" },
    ];
    render(
      <SearchBarDropDown
        hasKeyword={true}
        locationsIsFetching={false}
        locationsError={null}
        locations={locations}
        onLocationClick={noop}
      />
    );
    expect(screen.getByText("Selangor")).toBeInTheDocument();
    expect(screen.getByText("Kuala Lumpur")).toBeInTheDocument();
    expect(screen.getByText("State")).toBeInTheDocument();
    expect(screen.getByText("City")).toBeInTheDocument();
  });

  it("calls onLocationClick with the correct location when an item is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    const locations: SearchLocation[] = [
      { type: "City", title: "Kuala Lumpur", slug: "kuala-lumpur" },
    ];

    render(
      <SearchBarDropDown
        hasKeyword={true}
        locationsIsFetching={false}
        locationsError={null}
        locations={locations}
        onLocationClick={handleClick}
      />
    );

    await user.click(screen.getByText("Kuala Lumpur"));

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(locations[0]);
  });
});
