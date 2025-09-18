import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Task } from "../models/task.model";

const router = Router();

router.post("/tasks", authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;
        const user = (req as any).user;

        const task = new Task({ title, description, userId: user.id })
        await task.save()

        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({error: "Task creation failed"});
    }
})

router.get("/tasks", authMiddleware, async (req, res) => {
    try{
        const user = (req as any).user;
        const tasks = await Task.find({userId: user.id});
        res.json(tasks);
    }catch (err){
        res.status(500).json({error: "Fetching failed tasks."});
    }
})

router.put("/tasks/:id", authMiddleware, async (req, res, next) => {
    try{
        const user = (req as any).user;
        const { id } = req.params;

        const task = await Task.findOneAndUpdate({ _id:id, userId: user.id }, req.body, { new: true });

        if(!task) return res.status(404).json({error: "Task not found"});
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: "Task failed update"});
    }
})

router.delete("/tasks/:id", authMiddleware, async (req, res, next) => {
    try {
        const user = (req as any).user;
        const { id } = req.params;

        const task = await Task.findOneAndDelete({ _id: id, userId: user.id });
        
        if(!task) return res.status(404).json({error: "Task not found"});
        res.json({ message: "Task deleted"});
    } catch (err) {
        res.status(500).json({ error: "Task failed delete"})
    }
})

export default router;