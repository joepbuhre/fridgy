import { Router, Request, Response } from "express";
import { createLocation, getAllLocations } from "../controllers/locations";
const items = Router();

// router.use('/locations', locations)

items.get("/", getAllLocations);

items.post("/", createLocation);

items.put("/:ID", createLocation);

export default items;
