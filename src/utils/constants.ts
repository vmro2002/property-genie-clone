/**
 * Base API endpoint used for listings and locations
 */
export const API_ENDPOINT = "https://agents.propertygenie.com.my/api";

/**
 * Listing categories filter options
 */
export const LISTING_CATEGORIES = ["residential", "condo", "flat", "room"];

/**
 * Listing type filter options
 */
export const LISTING_TYPES = ["apartment", "condo", "flat", "room"];

/**
 * Listing bedrooms filter options
 */
export const LISTING_BEDROOMS = [
  {
    label: "Studio",
    value: 0,
  },
  {
    label: "1",
    value: 1,
  },
  {
    label: "2",
    value: 2,
  },
  {
    label: "3",
    value: 3,
  },
  {
    label: "4",
    value: 4,
  },
  {
    label: "5+",
    value: 5,
  },
];

/**
 * Listing bathrooms filter options
 */
export const LISTING_BATHROOMS = [1, 2, 3, 4, 5];

/**
 * Listing furnishings filter options
 */
export const LISTING_FURNISHINGS = [
  {
    label: "Unfurnished",
    value: "unfurnished",
  },
  {
    label: "Partially Furnished",
    value: "partially-furnished",
  },
  {
    label: "Fully Furnished",
    value: "fully-furnished",
  },
];

/**
 * Listing sort filter options
 */
export const LISTINGS_SORT_OPTIONS = [
  {
    label: "Price: Low to High",
    value: "price",
  },
  {
    label: "Price: High to Low",
    value: "-price",
  },
  {
    label: "Oldest Listings",
    value: "createdAt",
  },
  {
    label: "Newest Listings",
    value: "-createdAt",
  },
];
