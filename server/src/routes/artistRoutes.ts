import express, { Request, Response } from "express";
import { Artist } from "../models/artist";
import { redisClient } from "../app";

const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res
      .status(400)
      .send({ error: "Query parameter is required and must be a string" });
  }

  try {
    const cacheKey = `artists:${query.toLowerCase()}`;

    const cachedArtists = await redisClient.get(cacheKey);
    if (cachedArtists) {
      console.log(`Cache hit for query: ${query}`);
      return res.send(JSON.parse(cachedArtists));
    }
    console.log(`Cache miss for query: ${query}. Fetching from MongoDB.`);

    const artists = await Artist.aggregate([
      {
        $search: {
          index: "default",
          compound: {
            should: [
              {
                text: {
                  query: query,
                  path: "name",
                  score: { boost: { value: 10 } },
                },
              },
              {
                text: {
                  query: query,
                  path: "name",
                  fuzzy: {
                    maxEdits: 1,
                    prefixLength: 1,
                  },
                  score: { boost: { value: 5 } },
                },
              },
              {
                autocomplete: {
                  query: query,
                  path: "name",
                  fuzzy: {
                    maxEdits: 1,
                    prefixLength: 1,
                  },
                },
              },
            ],
            minimumShouldMatch: 1,
          },
        },
      },
      {
        $addFields: {
          exactMatch: {
            $cond: {
              if: { $eq: [{ $toLower: "$name" }, query.toLowerCase()] },
              then: 2,
              else: 0,
            },
          },
        },
      },
      {
        $sort: {
          exactMatch: -1,
          score: { $meta: "textScore" },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          genre: 1,
          location: 1,
          imageUrl: 1,
          score: { $meta: "searchScore" },
        },
      },
      {
        $limit: 10,
      },
    ]);

    await redisClient.set(cacheKey, JSON.stringify(artists), {
      EX: 86400,
    });

    res.send(artists);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).send({ error: "An error occurred while searching" });
  }
});

export { router as artistRouter };
