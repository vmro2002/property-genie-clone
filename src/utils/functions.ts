import type { ListingsResponse, ListingFilter } from "./types";
import { API_ENDPOINT } from "./constants";
import type { GetServerSidePropsContext } from "next";
import type { ParsedUrlQuery } from "querystring";
import Decimal from "decimal.js";
import type { FilterFormValues } from "@/schemas/filterSchema";

/**
 * Convert numeric string arrays or string in query params (e.g. bedRooms, bathRooms) to number arrays or numbers
 */
export const queryParamToNumberArray = (param: string | string[] | undefined): number[] => {
    if (param === undefined) return [];

    // If the param is a string, convert it to a number and return an array with the number
    if (typeof param === "string") {
        const n = Number(param);
        return Number.isNaN(n) ? [] : [n];
    }

    // If the param is an array, convert each string to a number and return an array of numbers
    return param
        .map((v) => Number(v))
        .filter((n): n is number => !Number.isNaN(n));
};

/**
 * Get the default filter values from the query params
 * and handle missing or invalid values
 */
export function getFilterDefaultsFromQuery(query: ParsedUrlQuery): FilterFormValues {
    const {
        minPrice: minPriceQuery,
        maxPrice: maxPriceQuery,
        categories: categoriesQuery,
        types: typesQuery,
        bedRooms: bedRoomsQuery,
        bathRooms: bathRoomsQuery,
        furnishings: furnishingsQuery,
    } = query;

    return {
        minPrice: minPriceQuery ? !isNaN(Number(minPriceQuery)) ? Number(minPriceQuery) : undefined : undefined,
        maxPrice: maxPriceQuery ? !isNaN(Number(maxPriceQuery)) ? Number(maxPriceQuery) : undefined : undefined,
        categories: categoriesQuery && typeof categoriesQuery === 'string' ? categoriesQuery : undefined,
        types: typeof typesQuery === 'string'? [typesQuery] : Array.isArray(typesQuery) ? typesQuery : [],
        bedRooms: queryParamToNumberArray(bedRoomsQuery),
        bathRooms: queryParamToNumberArray(bathRoomsQuery),
        furnishings: typeof furnishingsQuery === 'string' ? [furnishingsQuery] : Array.isArray(furnishingsQuery) ? furnishingsQuery : [],
    };
}

/**
 * Fetches the listing data from the API
 * used in getServerSideProps for the home page
 */
export async function getListingsData(ctx: GetServerSidePropsContext): Promise<ListingsResponse> {
    const { page, sort, q, section, state, city } = ctx.query;

    // set the default API query params
    const params = new URLSearchParams({
        page: String(page ?? 1),
        sort: String(sort ?? "createdAt"), // sort from oldest to newest
    });

    // construct the filter object for the API request
    const filter: FilterFormValues & { name?: string; section: 'rent' | 'sale', state?: string, city?: string } = {
        ...getFilterDefaultsFromQuery(ctx.query),
        section: section === "rent" || section === "sale" ? section : "sale",
        state: !city && typeof state === "string" ? state : undefined,
        city: typeof city === "string" ? city : undefined,
        name: typeof q === "string" ? q : undefined,
    };

    const res = await fetch(`${API_ENDPOINT}/properties-mock?${params.toString()}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(filter),
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch listings: ${res.status}`);
    }

    return res.json();
}

/**
 * calculates price per square foot for a listing
 */
export const getFormattedPricePsf = (floorSize: string, price: number) => {
    // using decimal.js to avoid floating point precision issues
    const psf = new Decimal(price).div(new Decimal(floorSize)).toFixed(2);

    return `RM ${psf} psf`;
}

/**
 * formats the price for a listing
 */
export const getFormattedPrice = (price: number) => {
    return `RM ${price.toLocaleString()}`;
}

/**
 * get capilatized initials form a name
 */
export const getUserInitials = (name: string) => {
    const splitName = name.split(" ");

    return (`${splitName[0][0]}${splitName[1] ? splitName[1][0] : ''}`).toUpperCase();
}

/**
 * safely parse a string to a float
 */
export const safeParseFloat = (value: string) => {
    try {
        const float = parseFloat(value);
        if (isNaN(float)) return undefined;
        return float;
    } catch {
        return undefined;
    }
}

/**
 * converts object over strings
 * always maintains the order of the keys unlike JSON.stringify()
 * critical for hashing filter objects for filter save
 */
export const stableStringify = (obj: any): string => {
    // if argument is a simple value, return the json string
    if (obj === null || typeof obj !== "object") {
        return JSON.stringify(obj);
    }
    
    // use recursion for arrays
    if (Array.isArray(obj)) {
        return `[${obj.map(stableStringify).join(",")}]`;
    }
    
    // sort the keys to maintain the order
    const keys = Object.keys(obj).sort();
    
    // return the stringified object
    return `{${keys
        .map((key) => `"${key}":${stableStringify(obj[key])}`)
        .join(",")}}`;
}

export const capitalizeFirstLetter = (word: string): string => {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

/**
 * formats a saved filter's summary for the saved filters modal
 */
export const formatFilterSummary = (filter: ListingFilter): {primary: string, secondary: string} => {
    let primaryText = ''

    primaryText += filter.section ? capitalizeFirstLetter(filter.section) : 'Sale'

    if (filter.state) {
      primaryText += ` • ${filter.state}`
    }
    if (filter.city) {
      primaryText += ` • ${filter.city}`
    }

    let secondaryText = ''
    if (filter.q) {
      secondaryText += `Search: "${filter.q}"`
    }

    secondaryText += `${filter.q ? ' •' : ''} ${filter.categories? capitalizeFirstLetter(filter.categories) : 'All Properties'}`

    return {
      primary: primaryText,
      secondary: secondaryText,
    }
  }