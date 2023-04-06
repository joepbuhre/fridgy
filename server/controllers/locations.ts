import { ItemsInventory, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

export const getAllLocations = (req: Request, res: Response) => {
    prisma.locations.findMany().then((db) => {
        res.send(db);
    });
};

export const createLocation = (req: Request, res: Response) => {
    prisma.locations
        .upsert({
            create: {
                Name: req.body.Name,
            },
            update: {
                Name: req.body.Name,
            },
            where: {
                ID: req.body.ID,
            },
        })
        .then((resp) => {
            logger.debug("Updated item");
            res.end();
        })
        .catch((err) => {
            logger.debug("Error adding location");
            res.send(err);
        });
};
