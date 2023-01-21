import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getAllItem = (req: Request, res: Response) => {
    prisma.itemsInventory.findMany().then((db) => {
        res.send(db);
    });
};

export const getItem = (req: Request, res: Response) => {
    console.log(req.params.EAN)
    prisma.itemsInventory.findMany({
        where: { EAN: req.params.EAN },
    }).then(resp => {
        res.send(resp)
    })
};

export const createItem = (req: Request, res: Response) => {
    async function main() {
        const user = await prisma.itemsInventory.create({
            data: {
                EAN: "87338010",
                Expiry: new Date("2022-01-01"),
                Stock: 1,
            },
        });
        console.log(user);
    }
};
