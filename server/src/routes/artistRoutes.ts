import { Router } from "express";
import { getArtists } from "../controllers/artistConroller";

const router = Router();

router.get("/search", getArtists);

export default router;
