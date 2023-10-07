import { ItemInventory, PrismaClient, ScannedItem } from "@prisma/client";
import { Request, Response } from "express";
import { AddItemProduct, ItemDeep, ItemInventoryDeep, ItemInventoryDeepOld } from "../../types/AddItem";
import { logger } from "../utils/logger";
import * as items from "../models/items";
import { NotFoundError, PrismaClientKnownRequestError } from "@prisma/client/runtime";

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
        .findFirstOrThrow({
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
        .catch((err: PrismaClientKnownRequestError) => {
            if (err.code === "P2025") {
                res.status(404).send("no item found");
            } else {
                res.status(500).send(err);
            }
            logger.error(err);
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
            logger.debug(body);
        });
};

export const updateItemInventory = (req: Request, res: Response) => {
    let body: ItemDeep = req.body;

    if (body.Inventory === undefined) {
        return;
    }

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
        ...body?.Inventory.map((el) => {
            return prisma.itemInventory.upsert({
                create: {
                    Stock: el.Stock,
                    LocationID: el.LocationID,
                    Expiry: el.Expiry ? new Date(el.Expiry) : null,
                    EAN: el.EAN,
                    ItemId: el.ItemId,
                },
                update: {
                    Stock: el.Stock,
                    LocationID: el.LocationID,
                    Expiry: el.Expiry ? new Date(el.Expiry) : null,
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

export const scanItem = async (req: Request, res: Response) => {
    const body = req.body as ScannedItem;

    let scanId: number | null = body.ScanId ?? 0;
    logger.debug(scanId)
    if (scanId === 0) {
        scanId = (
            await prisma.scannedItem.aggregate({
                _max: {
                    ScanId: true,
                },
            })
        )._max.ScanId;

        body.ScanId = (scanId ?? 0) + 1;
    }
    
    logger.info(body, "Scanid is set to: ")

    await prisma.scannedItem.create({
        data: {
            EAN: body.EAN,
            ScanId: body.ScanId
        },
    });

    prisma.scannedItem.findMany({
        where: {
            ScanId: body.ScanId
        }
    }).then((result) => {
        res.send(result);
    });
};

export const deleteScan = async (req: Request, res: Response) => {
    prisma.scannedItem.deleteMany({
        where: {
            ScanId: parseInt(req.params.scanId)
        }
    }) 
    .then((resp) => {
        res.send(resp);
        logger.debug(`sucesfully delete record with id: ${req.params.ID}`);
    })
    .catch((err) => {
        logger.error(`Deleting not succesfull`);
    });
}