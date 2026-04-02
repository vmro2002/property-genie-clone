export const API_ENDPOINT = "https://agents.propertygenie.com.my/api";

/**
 * Listing categories filter options
 */
export const LISTING_CATEGORIES = [
    'residential',
    'condo',
    'flat',
    'room'
]

/**
 * Listing type filter options
 */
export const LISTING_TYPES = [
    'apartment',
    'condo',
    'flat',
    'room'
]

/**
 * Listing bedrooms filter options
 */
export const LISTING_BEDROOMS =  [0, 1, 2, 3, 4, 5]

/**
 * Listing bathrooms filter options
 */
export const LISTING_BATHROOMS = [1, 2, 3, 4, 5]

/**
 * Listing furnishings filter options
 */
export const LISTING_FURNISHINGS = [
    {
        label: 'Unfurnished',
        value: 'unfurnished'
    },
    {
        label: 'Partially Furnished',
        value: 'partially-furnished'
    },
    {
        label: 'Fully Furnished',
        value: 'fully-furnished'
    }
]

const fakeListing = {
    imgUrl: "/listing.jpg",
    price: 2600000,
    name: "Kenny Hills Residence, Bukit Tunku Kuala Lumpur",
    address: "Kuala Lumpur, 50480, Kuala Lumpur, Malaysia",
    bedRomms: 5,
    bathRooms: 6,
    floorSize: "3627.00",
    account: {
      name: "bisyardi bin Mohamad Hasbi",
      phone: "60123456789",
    },
  };