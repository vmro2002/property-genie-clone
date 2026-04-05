import type { FilterFormValues } from "@/schemas/filterSchema";

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

export type SearchLocation = {
    type: string;
    title: string;
    slug: string;
}

export type FilterSaveToast = {
    open: boolean;
    message: string;
    severity: "success" | "info" | "error";
};

export type ListingFilter = FilterFormValues & {
    id: string
    section?: 'rent' | 'sale'
    state?: string 
    city?: string
    name?: string
    q?: string
}