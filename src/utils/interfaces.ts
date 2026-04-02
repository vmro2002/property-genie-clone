/**
 * Interface for ListingCard component
 */
export interface ListingCardProps {
    isVertical?: boolean;
    imgUrl: string; 
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