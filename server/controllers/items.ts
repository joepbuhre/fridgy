import { ItemsInventory, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AddItemProduct } from "../../types/AddItem";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

export const getAllItem = (req: Request, res: Response) => {
    prisma.itemsInventory.findMany().then((db) => {
        res.send(db);
    });
};

export const getItem = (req: Request, res: Response) => {
    console.log(req.params.EAN);
    prisma.itemsInventory
        .findMany({
            where: { EAN: req.params.EAN },
        })
        .then((resp) => {
            res.send(resp);
        });
};

export const deleteItem = (req: Request, res: Response) => {
    prisma.itemsInventory.delete({
        where: {
            ID: parseInt(req.params.ID)
        }
    })
    .then(resp => {
        logger.debug(`sucesfully delete record with id: ${req.params.ID}`)
    })
    .catch(err => {
        logger.error(`Deleting not succesfull`)
    })
}

export const createItem = (req: Request, res: Response) => {
    let body: AddItemProduct[];

    if (!Array.isArray(req.body)) {
        body = [req.body];
    } else {
        body = req.body;
    }

    Promise.all(
        body.map((ii) => prisma.itemsInventory.create({ data: {
            EAN: ii.ean,
            Expiry: new Date(ii.tht),
            Stock: parseInt(ii.count)   
        }}))
    )
    .then(resp => {
        res.status(201)
        logger.debug(`${body.length} item(s) succesfully created`)
    })
    .catch(err => {
        res.status(500).send(err)
        logger.error(err, 'error has happened')
    })
};
