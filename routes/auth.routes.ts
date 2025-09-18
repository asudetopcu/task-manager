import { Router } from "express";
import { register, login } from "../services/auth.services.ts";

const router = Router();

router.post("/register", async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const result = await register(name, email, password);
        res.status(201).json(result);
    } catch (err: any) {
        res.status(err.status || 500).json({error: err.message, details: err.details});
    }
})

router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await login(email, password);
        res.status(201).json(result);
    } catch (err: any) {
        res.status(err.status || 500).json({error: err.message, details: err.details});
    }
})

export default router;