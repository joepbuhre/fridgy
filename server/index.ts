import { PrismaClient } from "@prisma/client";
import express, { Request, Response, Router } from "express";
import { config } from "dotenv";
import cors from "cors";
import items from "./routes/items";
import locations from "./routes/locations";
import { logger } from "./utils/logger";
import init from "./controllers/init";

config({
    path: "../.env",
});

const prisma = new PrismaClient();

const app = express();

const router = Router();

app.use(cors());
app.use(express.json());

router.use("/items", items);
router.use("/locations", locations);

app.use("/api", router);

app.listen(process.env.BACKEND_PORT, async () => {
    await init();
    logger.info(`Listening on ${process.env.BACKEND_PORT} 🚀`);
});
