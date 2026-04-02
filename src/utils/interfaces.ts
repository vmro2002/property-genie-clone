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