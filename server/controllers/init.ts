import { ItemInventory, Prisma, PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

// Need to do this because Postgres sequence can get out of sync with table
const setSequence = async () => {
    // Filter only our tables
    const tables = Object.entries(prisma)
        .filter((el) => {
            return !["_", "$"].includes(el[0].substring(0, 1));
        })
        .map((el) => {
            return el[1].name;
        })

    for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        logger.debug(`Set sequence for ${table}`)
        await prisma.$queryRawUnsafe(`SELECT setval(pg_get_serial_sequence('"${table}"', 'ID'), coalesce(max("ID")+1, 1), false) FROM "${table}";`)
    }
};

export default async (): Promise<void> => {
    // Fix sequences when you manually insert ID's in DB
    await setSequence();

    return Promise.resolve();
};
