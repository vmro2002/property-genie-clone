import { ListingsResponse } from "./types";
import { API_ENDPOINT } from "./constants";
import type {GetServerSidePropsContext} from "next";

export async function getListingsData(ctx: GetServerSidePropsContext): Promise<ListingsResponse> {

    const {
        page
    } = ctx.query;
    
    const res = await fetch(`${API_ENDPOINT}/properties-mock?page=${page ?? 1}`, {
        method: 'POST',
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch listings: ${res.status}`);
    }

    return res.json();
}

export const getFormattedPricePsf = (floorSize: string, price: number) => {
    const numericSize = parseFloat(floorSize);
    const psf = isNaN(numericSize) || numericSize === 0 ? 0 : price / numericSize;

    return `RM ${psf.toFixed(2)} psf`;
}

export const getFormattedPrice = (price: number) => {
    return `RM ${price.toLocaleString()}`;
}

export const getUserInitials = (name: string) => {
    const splitName = name.split(" ");

    return (`${splitName[0][0]} ${splitName[1] ? splitName[1][0] : ''}`).toUpperCase();
}