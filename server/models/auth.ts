import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

export const getAuthRedirect = (url: string): string => {
    if (
        process.env.AUTH_LOGOUT_URL !== "false" &&
        process.env.AUTH_LOGOUT_URL !== undefined &&
        process.env.AUTH_REDIRECT_PARAM !== undefined
    ) {
        const base = new URL(process.env.AUTH_LOGOUT_URL);
        base.searchParams.append(process.env.AUTH_REDIRECT_PARAM, url);
        return base.toString();
    } else {
        return "false";
    }
};
