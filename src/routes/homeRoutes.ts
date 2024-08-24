import {Router, Request, Response} from "express";
import path from "path";

const router = Router();

// Route to serve index.html
router.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

export default router;
