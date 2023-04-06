import { Router, Request, Response } from "express";
import {
    createItem,
    deleteItem,
    getAllItem,
    getItem,
    getShoppingList,
    updateItem,
    consumeItem,
} from "../controllers/items";
const items = Router();

// router.use('/items', items)

items.get("/", getAllItem);

items.put("/", updateItem);

items.get("/shopping-list", getShoppingList);

items.get("/:EAN", getItem);

items.delete("/:ID", deleteItem);

items.post("/create", createItem);

items.post("/consume/:ID", consumeItem);

export default items;
