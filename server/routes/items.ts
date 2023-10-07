import { Router, Request, Response } from "express";

import {
    createItem,
    deleteItem,
    getAllItem,
    getItem,
    getShoppingList,
    updateItem,
    consumeItem,
    getAllItemInventory,
    updateItemInventory,
    getWithoutBarcode,
    scanItem,
    deleteScan
} from "../controllers/items";
const items = Router();

// router.use('/items', items)

items.get("/inventory", getAllItemInventory);

items.get('/', getAllItem)

items.put("/", updateItem);

items.get('/withoutBarcode', getWithoutBarcode);

items.put("/inventory", updateItemInventory);

items.get("/shopping-list", getShoppingList);

items.get("/:EAN", getItem);

items.delete("/:ID", deleteItem);

items.post("/create", createItem);

items.post("/consume/:ID", consumeItem);

items.post("/scan", scanItem)

items.delete('/scan/:scanId', deleteScan)

export default items;
