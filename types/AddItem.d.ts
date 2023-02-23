import { Product } from "./FoodProduct";
import { ItemsInventory } from "@prisma/client";
import type { Locations } from "@prisma/client";


export interface AddItemProduct {
    ean: string,
    count: string,
    tht: string,
    location: string,
    foodfacts?: Product
    id?: string
}

interface ItemsInventoryDeep extends ItemsInventory  {
    Location: Locations
}