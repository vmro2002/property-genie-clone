import { ListingsResponse } from "./types";
import { API_ENDPOINT } from "./constants";
import type { GetServerSidePropsContext } from "next";
import type { ParsedUrlQuery } from "querystring";
import Decimal from "decimal.js";
import type { FilterFormValues } from "@/schemas/filterSchema";

export const queryParamToNumberArray = (param: string | string[] | undefined): number[] => {
    if (param === undefined) return [];
    if (typeof param === "string") {
        const n = Number(param);
        return Number.isNaN(n) ? [] : [n];
    }
    return param
        .map((v) => Number(v))
        .filter((n): n is number => !Number.isNaN(n));
};

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

export async function getListingsData(ctx: GetServerSidePropsContext): Promise<ListingsResponse> {
    const { page, sort, q, section } = ctx.query;

    const params = new URLSearchParams({
        page: String(page ?? 1),
        sort: String(sort ?? "price"),
    });

    const filter: FilterFormValues & { name?: string; section: 'rent' | 'sale' } = {
        ...getFilterDefaultsFromQuery(ctx.query),
        section: section === "rent" || section === "sale" ? section : "sale",
    };
    if (typeof q === "string") filter.name = q;

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

export const getFormattedPricePsf = (floorSize: string, price: number) => {
    // using decimal.js to avoid floating point precision issues
    const psf = new Decimal(price).div(new Decimal(floorSize)).toFixed(2);

    return `RM ${psf} psf`;
}

export const getFormattedPrice = (price: number) => {
    return `RM ${price.toLocaleString()}`;
}

export const getUserInitials = (name: string) => {
    const splitName = name.split(" ");

    return (`${splitName[0][0]}${splitName[1] ? splitName[1][0] : ''}`).toUpperCase();
}

export const safeParseFloat = (value: string) => {
    try {
        const float = parseFloat(value);
        if (isNaN(float)) return undefined;
        return float;
    } catch {
        return undefined;
    }
}