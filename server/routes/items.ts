import { Router, Request, Response } from "express";
import { createItem, deleteItem, getAllItem, getItem, updateItem } from "../controllers/items";
const items = Router()

// router.use('/items', items)

items.get('/', getAllItem)

items.put('/', updateItem)

items.get('/:EAN', getItem)

items.delete('/:ID', deleteItem)

items.post('/create', createItem)


export default items