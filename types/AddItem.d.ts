import { Product } from "./FoodProduct";

export interface AddItemProduct {
    ean: string,
    count: string,
    tht: string,
    location: int,
    foodfacts?: Product
}