import { Router, Request, Response } from "express";
import { getAllLocations } from "../controllers/locations";
const items = Router()

// router.use('/locations', locations)

items.get('/', getAllLocations)


export default items