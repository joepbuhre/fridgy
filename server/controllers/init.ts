import { ItemInventory, PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

export default async (): Promise<void> => {
    // Create locations
    logger.debug("no init scripts defined");
    return Promise.resolve();
};
