import { Request, Response } from "express";
import { searchArtists } from "../services/artistService";

export const getArtists = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Query parameter is required" });
    }
    const artists = await searchArtists(q.toString());
    return res.json(artists);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
