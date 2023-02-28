import { Product } from "./FoodProduct";
import { Items, ItemsInventory } from "@prisma/client";
import type { Locations } from "@prisma/client";


export interface AddItemProduct {
    ean: string,
    count: string,
    tht: string,
    location: string,
    foodfacts?: Product
    id?: string
    productName?: string
}

interface ItemsInventoryDeep extends ItemsInventory  {
    Location?: Locations,
}
interface ItemsInventoryDeepOld extends ItemsInventory  {
    Location?: Locations,
    Item: Items
}

interface ItemsDeep extends Items {
    Inventory: ItemsInventoryDeep[]
}