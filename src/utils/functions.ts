import { ListingsResponse } from "./types";
import { API_ENDPOINT } from "./constants";
import type {GetServerSidePropsContext} from "next";
import Decimal from "decimal.js";

export async function getListingsData(ctx: GetServerSidePropsContext): Promise<ListingsResponse> {

    const { page, sort } = ctx.query;

    const params = new URLSearchParams({
        page: String(page ?? 1),
        sort: String(sort ?? 'price'),
    });
    
    const res = await fetch(`${API_ENDPOINT}/properties-mock?${params.toString()}`, {
        method: 'POST',
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