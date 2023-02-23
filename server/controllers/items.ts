import { ItemsInventory, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AddItemProduct, ItemsInventoryDeep } from "../../types/AddItem";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

export const getAllItem = (req: Request, res: Response) => {
    prisma.itemsInventory.findMany({
        include: { Location: {
            select: {
                Name: true
            }
        } }
    }).then((db) => {
        res.send(db);
    });
};

export const getItem = (req: Request, res: Response) => {
    prisma.itemsInventory
        .findFirst({
            where: { EAN: req.params.EAN },
            include: { Location: true }
        })
        .then((resp) => {
            logger.debug('fetched item ' + req.params.EAN)
            res.send(resp);
        })
        .catch(err => {
            logger.error(err)
            res.status(500).send(err)
        })
};

export const deleteItem = (req: Request, res: Response) => {
    prisma.itemsInventory
        .delete({
            where: {
                ID: parseInt(req.params.ID),
            },
        })
        .then((resp) => {
            res.send(resp)
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
                    LocationID: parseInt(ii.location)
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
    let body: ItemsInventoryDeep = req.body

    prisma.itemsInventory.update({
        data: {
            EAN: body.EAN,
            Expiry: new Date(body.Expiry),
            LocationID: body.LocationID,
            Stock: body.Stock
        },
        where: {
            ID: body.ID
        }
    }).then(resp => {
        logger.debug('Updated item', resp.EAN)
        res.send(resp)
    }).catch(err => {
        logger.error(err)
        res.status(500).send(err)
    })

}