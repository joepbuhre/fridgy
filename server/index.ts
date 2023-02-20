import { PrismaClient } from "@prisma/client";
import express, { Request, Response, Router } from "express";
import { config } from "dotenv";
import cors from 'cors'
import items from "./routes/items";
import { logger } from "./utils/logger";

config({
    path: "../.env",
});

const prisma = new PrismaClient();


const app = express();

const router = Router()

app.use(cors())
app.use(express.json());

router.use('/items', items)

app.use('/api', router)

app.listen(process.env.BACKEND_PORT, () => {
    logger.debug(`Listening on ${process.env.BACKEND_PORT} 🚀`)
});
