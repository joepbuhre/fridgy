import { isDate } from "@vue/shared";
import moment from "moment";
import type { Product } from "../../../types/FoodProduct";


export const prettydelta = (date: Date | string) => {
    const diff = rawDelta(date);
    if (diff > 1) {
        return `${diff} days`;
    } else {
        return `${diff} day`;
    }
};

export const rawDelta = (date: Date | string) => {
    const now = moment();

    if (!isDate(date)) {
        date = new Date(date);
    }

    const diff = moment(date).diff(now, "days");

    return diff;
};

export const getProductName = (product: Product | undefined): string => {
    if (product === undefined) {
        return "onbekend";
    } else if (product.product_name_nl) {
        return product.product_name_nl;
    } else if (product.product_name_en) {
        return product.product_name_en;
    } else if (product.product_name) {
        return product.product_name;
    } else {
        return "onbekend";
    }
};

export const raw = (variable: any) => {
    return JSON.parse(JSON.stringify(variable));
};

export const getAuthRedirect = (): string => {

    const base = new URL(import.meta.env.VITE_LOGIN_URL)
    base.searchParams.append('rd', window.location.href)

    return base.toString()
}