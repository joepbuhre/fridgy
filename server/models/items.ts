import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";
import {
    AddItemProduct,
    ItemDeep,
    ItemInventoryDeep,
    ItemInventoryDeepOld,
} from "../../types/AddItem";

const prisma = new PrismaClient();
  
export const consumeItem = async (ItemInventoryID: number) => {
    const count = await prisma.itemInventory.findFirst({
        where: {
            ID: ItemInventoryID,
        },
        select: {
            EAN: true,
            Stock: true,
        },
    });

    if (count?.Stock === undefined) {
        return;
    }

    // Update stock or delete if 0
    if (count.Stock <= 1) {
        await prisma.itemInventory.delete({
            where: {
                ID: ItemInventoryID,
            },
        });
    } else {
        await prisma.itemInventory.update({
            data: {
                Stock: count.Stock - 1,
            },
            where: {
                ID: ItemInventoryID,
            },
        });
    }

    return await prisma.item.findFirst({
        where: { EAN: count.EAN },
        include: {
            Inventory: {
                include: {
                    Location: true,
                },
            },
        },
    });
};

export const addItem = (additems: AddItemProduct[]) => {
    return Promise.all(
        additems.map((ii) =>
            prisma.itemInventory.create({
                data: {
                    EAN: ii.ean,
                    Expiry: (ii.tht ? new Date(ii.tht) : null),
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
}