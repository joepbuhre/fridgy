import { PrismaClient } from "@prisma/client";
import express, { Request, Response, Router, static as _static } from "express";
import { config } from "dotenv";
import cors from "cors";
import items from "./routes/items";
import locations from "./routes/locations";
import { logger } from "./utils/logger";
import init from "./controllers/init";
import auth from "./routes/auth";
import { resolve } from "path";

config({
    path: "../.env",
});

const prisma = new PrismaClient();

const app = express();

const router = Router();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
    // Implement static
    app.use("/", _static(resolve(__dirname, "../frontend")));
    logger.debug('serving frontend from dist')
} else {
    logger.debug("Start frontend with `npm run dev:frontend`");
}

router.use("/items", items);
router.use("/locations", locations);
router.use("/auth", auth)

app.use("/api", router);

app.listen(process.env.BACKEND_PORT, async () => {
    await init();
    logger.info(`Listening on ${process.env.BACKEND_PORT} 🚀`);
});
