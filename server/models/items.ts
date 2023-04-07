import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

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
