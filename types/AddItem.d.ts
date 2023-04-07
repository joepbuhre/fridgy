import { Product } from "./FoodProduct";
import { Item, ItemInventory } from "@prisma/client";
import type { Location } from "@prisma/client";


export interface AddItemProduct {
    ean: string,
    count: string,
    tht: string,
    location: string,
    foodfacts?: Product
    id?: string
    productName?: string
}

interface ItemInventoryDeep extends ItemInventory  {
    Location?: Location,
}
interface ItemInventoryDeepOld extends ItemInventory  {
    Location?: Location,
    Item: Item
}

interface ItemDeep extends Item {
    Inventory: ItemInventoryDeep[]
}