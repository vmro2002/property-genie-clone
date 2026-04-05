import type { FilterFormValues } from "@/schemas/filterSchema";

/**
 * Type of the data returned form listing endpoint
 */
export type ListingsResponse = {
    items: {
        id: string;
        name: string;
        slug: string;
        type: string;
        category: string;
        section: string;
        image: string;
        bedRooms: number;
        bathRooms: number;
        floorSize: string;
        landSize: string | null;
        address: string;
        price: number;
        account: {
            id: string;
            name: string;
            email: string;
            phone: string;
            slug: string;
        };
        country: string;
        state: string;
        city: string;
        postcode: string;
        furnishings: string;
        coordinates: {
            longitude: number;
            latitude: number;
        };
        createdAt: string;
    }[],
    _links: {
        self: {
            href: string;
            method: string;
            path: string
        };
        first: {
            href: string;
            method: string;
            path: string
        };
        last: {
            href: string;
            method: string;
            path: string
        };
    }
    _meta: {
        totalCount: number; 
        pageCount: number;
        currentPage: number;
        perPage: number;
    }
}

/**
 * Type of the data returned form search location endpoint
 */
export type SearchLocation = {
    type: string;
    title: string;
    slug: string;
}

/**
 * Type of the toast data for filter save
 */
export type FilterSaveToast = {
    open: boolean;
    message: string;
    severity: "success" | "info" | "error";
};

/**
 * Type of the filter data for filter save
 */
export type ListingFilter = FilterFormValues & {
    id: string
    section?: 'rent' | 'sale'
    state?: string 
    city?: string
    name?: string
    q?: string
}