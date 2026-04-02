/**
 * Base API endpoint used for listings and locations
 */
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

/**
 * Listing sort filter options
 */
export const LISTINGS_SORT_OPTIONS = [
    { 
        label: 'Price: Low to High',
        value: 'price'
    },
    {
        label: 'Price: High to Low',
        value: '-price'
    },
    {
        label: 'Oldest Listings',
        value: 'createdAt'
    },
    {
        label: 'Newest Listings',
        value: '-createdAt'
    }
]