import { ItemInventory, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
    AddItemProduct,
    ItemDeep,
    ItemInventoryDeep,
    ItemInventoryDeepOld,
} from "../../types/AddItem";
import { logger } from "../utils/logger";
import * as items from "../models/items";

const prisma = new PrismaClient();

export const getAllItem = (req: Request, res: Response) => {
    prisma.item.findMany({}).then((db) => {
        res.send(db);
    });
};

export const getAllItemInventory = (req: Request, res: Response) => {
    prisma.item
        .findMany({
            include: {
                Inventory: {
                    include: {
                        Location: true,
                    },
                },
            },
        })
        .then((db) => {
            res.send(db);
        });
};

export const getItem = (req: Request, res: Response) => {
    prisma.item
        .findFirst({
            where: { EAN: req.params.EAN },
            include: {
                Inventory: {
                    include: {
                        Location: true,
                    },
                },
            },
        })
        .then((resp) => {
            logger.debug("fetched item " + req.params.EAN);
            res.send(resp);
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).send(err);
        });
};

export const deleteItem = (req: Request, res: Response) => {
    prisma.itemInventory
        .delete({
            where: {
                ID: parseInt(req.params.ID),
            },
        })
        .then((resp) => {
            res.send(resp);
            logger.debug(`sucesfully delete record with id: ${req.params.ID}`);
        })
        .catch((err) => {
            logger.error(`Deleting not succesfull`);
        });
};

export const createItem = (req: Request, res: Response) => {
    let body: AddItemProduct[];

    if (!Array.isArray(req.body)) {
        body = [req.body];
    } else {
        body = req.body;
    }

    items
        .addItem(body)
        .then((resp) => {
            res.status(201).send(resp);
            logger.debug(`${body.length} item(s) succesfully created`);
        })
        .catch((err) => {
            res.status(500).send(err);
            logger.error(err, "error has happened");
            logger.debug(body)
        });
};

export const updateItemInventory = (req: Request, res: Response) => {
    let body: ItemDeep = req.body;

    Promise.all([
        prisma.item.update({
            data: {
                EAN: body.EAN,
                ProductName: body.ProductName,
                Reorder: Boolean(body.Reorder),
            },
            where: {
                ID: body.ID,
            },
        }),
        ...body.Inventory.map((el) => {
            return prisma.itemInventory.upsert({
                create: {
                    Stock: el.Stock,
                    LocationID: el.LocationID,
                    Expiry: new Date(el.Expiry),
                    EAN: el.EAN,
                    ItemId: el.ItemId,
                },
                update: {
                    Stock: el.Stock,
                    LocationID: el.LocationID,
                    Expiry: new Date(el.Expiry),
                },
                where: {
                    ID: el.ID,
                },
            });
        }),
    ])
        .then((resp) => {
            logger.debug("Updated item", body.EAN);
            console.log(resp);
            res.send(resp);
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).send(err);
        });
};

export const updateItem = (req: Request, res: Response) => {
    let body: ItemDeep = req.body;

    Promise.all([
        prisma.item.update({
            data: {
                EAN: body.EAN,
                ProductName: body.ProductName,
                Reorder: Boolean(body.Reorder),
                HasBarcode: body.HasBarcode,
            },
            where: {
                ID: body.ID,
            },
        }),
    ])
        .then((resp) => {
            logger.debug("Updated item", body.EAN);
            console.log(resp);
            res.send(resp);
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).send(err);
        });
};

export const getShoppingList = (req: Request, res: Response) => {
    prisma.item
        .findMany({
            where: {
                Reorder: true,
            },
        })
        .then((resp) => {
            logger.debug("got shoppinglist");
            res.send(resp);
        })
        .catch((err) => {
            logger.debug("Error occured while fetching shopping list");
            logger.debug(err);
            res.status(500).end();
        });
};

export const consumeItem = (req: Request, res: Response) => {
    items.consumeItem(parseInt(req.params.ID)).then((resp) => {
        res.send(resp);
    });
};

export const getWithoutBarcode = (req: Request, res: Response) => {
    prisma.item
        .findMany({
            where: {
                HasBarcode: false,
            },
        })
        .then((resp) => {
            logger.debug("Got all items without barcodes");
            res.send(resp);
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).send(err);
        });
};
