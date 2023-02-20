import { Router, Request, Response } from "express";
import { createItem, deleteItem, getAllItem, getItem } from "../controllers/items";
const items = Router()

// router.use('/items', items)

items.get('/', getAllItem)

items.get('/:EAN', getItem)
items.delete('/:ID', deleteItem)

items.post('/create', createItem)

items.post('/log', (req: Request, res: Response) => {
    res.end()
    console.log(req.body)
})


export default items