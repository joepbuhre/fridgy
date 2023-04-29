import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { getAuthRedirect } from "../models/auth";

export const LogoutUrl = (req: Request, res: Response) => {
    if(req.query.redirect) {
        const url = getAuthRedirect((req.query.redirect as string))
        
        if(url !== 'false') {
            res.redirect(url)
            logger.debug(`redirecting to ${req.query.redirect}`)
        } else {
            res.send('')
            logger.debug(`redirect not succesful: ${url}`)
        }
    }
};

