import { ItemsInventory, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AddItemProduct, ItemsDeep, ItemsInventoryDeep, ItemsInventoryDeepOld } from "../../types/AddItem";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

export const getAllItem = (req: Request, res: Response) => {
    prisma.items
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
    prisma.items
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
    prisma.itemsInventory
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

    Promise.all(
        body.map((ii) =>
            prisma.itemsInventory.create({
                data: {
                    EAN: ii.ean,
                    Expiry: new Date(ii.tht),
                    Stock: parseInt(ii.count),
                    Location: {
                        connect: {
                            ID: parseInt(ii.location),
                        },
                    },
                    Item: {
                        connectOrCreate: {
                            create: {
                                EAN: ii.ean,
                                ProductName: ii?.productName || null,
                            },
                            where: {
                                EAN: ii.ean,
                            },
                        },
                    },
                },
            })
        )
    )
        .then((resp) => {
            res.status(201).send(resp);
            logger.debug(`${body.length} item(s) succesfully created`);
        })
        .catch((err) => {
            res.status(500).send(err);
            logger.error(err, "error has happened");
        });
};

export const updateItem = (req: Request, res: Response) => {
    let body: ItemsDeep = req.body;

    Promise.all([
        prisma.items.update({
            data: {
                EAN: body.EAN,
                ProductName: body.ProductName,
                Reorder: Boolean(body.Reorder)
            },
            where: {
                ID: body.ID,
            },
        }),
        ...body.Inventory.map(el => {
            return prisma.itemsInventory.update({
                data: {
                    Stock: el.Stock,
                    LocationID: el.LocationID,
                    Expiry: new Date(el.Expiry)
                },
                where: {
                    ID: el.ID
                }
            })
        })
    ])
        .then((resp) => {
            logger.debug("Updated item", body.EAN);
            console.log(resp)
            res.send(resp);
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).send(err);
        });
};

export const getShoppingList = (req: Request, res: Response) => {
    prisma.items.findMany({
        where: {
            Reorder: true
        }
    }).then(resp => {
        logger.debug('got shoppinglist')
        res.send(resp)
    }).catch(err => {
        logger.debug('Error occured while fetching shopping list')
        logger.debug(err)
        res.status(500).end()

    })
}
