import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers["authorization"];
        if(!authHeader) {
            return res.status(401).json({ error: "No authorization header."});
        }

        const token = authHeader.split(" ")[1];
        if(!token) {
            return res.status(401).json({ error: "Invalid authorization header."})
        }

        const secret = process.env.JWT_SECRET;
        if(!secret) {
            throw new Error("JWT_SECRET not configured.");
        }

        const decoded = jwt.verify(token, secret);

        (req as any).user = decoded;

        next();
    } catch ( err: any ) {
        return res.status(401).json({ error: "Invalid or expired token."})
    }
}