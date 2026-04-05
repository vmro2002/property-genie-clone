import type { SearchLocation, ListingFilter } from "./types";

/**
 * Interface for ListingCard component
 */
export interface ListingCardProps {
    isVertical?: boolean;
    imgUrl: string; 
    eagerLoadImg?: boolean
    price: number;
    name: string;
    address: string;
    bedRomms: number;
    bathRooms: number;
    floorSize: string;
    account: {
        name: string; 
        phone: string;
    }
}

/**
 * Interface for ListingCardStatItem component
 */
export interface ListingCardStatItemProps {
    icon: React.ReactNode;
    label: string | number;
}

/**
 * Interface for Menu component
 */
export interface MenuProps {
    items: { label: string; value: string }[];
    selectedItem: string;
    onItemSelect: (value: string) => void;
    onClear?: () => void;
    title?: string;
}

/**
 * Interface for ViewSelector component
 */
export interface ViewSelectorProps {
    isVerticalView: boolean;
    onChange: (isVertical: boolean) => void;
}

/**
 * Interface for SearchBarDropDown component
 */
export interface SearchBarDropDownProps {
    hasKeyword: boolean;
    locationsIsFetching: boolean;
    locationsError: Error | null;
    locations: SearchLocation[] | undefined;
    onLocationClick: (slug: SearchLocation) => void;
}

/**
 * Interface for FilterOptionToggle component
 */
export interface FilterOptionToggleProps {
    label: string;
    value: string | number;
    icon?: React.ReactElement;
    isSelected: boolean;
    onClick: (value: string | number) => void;
}

/**
 * Props for SavedFiltersModal component
 */
export interface SavedFiltersModalProps {
    open: boolean;
    onClose: () => void;
    savedItems: ListingFilter[];
    isEmpty: boolean;
    onDelete: (filterId: string) => void;
    onApply: (filterId: string) => void;
}