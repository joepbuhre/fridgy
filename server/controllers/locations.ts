import { ItemsInventory, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

export const getAllLocations = (req: Request, res: Response) => {
    prisma.locations.findMany().then((db) => {
        res.send(db);
    });
};