import { Product } from "./FoodProduct";

export interface AddItemProduct {
    ean: string,
    count: number,
    tht: Date | null,
    foodfacts?: Product
}