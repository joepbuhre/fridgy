import { ItemsInventory, PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

export default async () => {
    // Create locations
    if (process.env.FRIDGY_LOCATIONS) {
        JSON.parse(process.env.FRIDGY_LOCATIONS).forEach(async (loc: string) => {
            logger.debug(`Creating / Updating location: ${loc}`)
            await prisma.locations.upsert({
                where: {
                    Name: loc
                },
                update: {
                    Name: loc
                },
                create: {
                    Name: loc
                }
            });
        });
    }
};
