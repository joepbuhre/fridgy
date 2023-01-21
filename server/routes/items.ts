import { Router } from "express";
import { createItem, getAllItem, getItem } from "../controllers/items";
const items = Router()

// router.use('/items', items)

items.get('/', getAllItem)

items.get('/:EAN', getItem)

items.get('/create', createItem)

export default items