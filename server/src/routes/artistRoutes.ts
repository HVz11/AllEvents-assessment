import express, { Request, Response } from 'express';
import { Artist } from '../models/artist';

const router = express.Router();

router.get('/search', async (req: Request, res: Response) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).send({ error: 'Query parameter is required' });
  }

  try {
    const artists = await Artist.aggregate([
      {
        $search: {
          index: 'default',
          autocomplete: {
            query: query,
            path: 'name',
            fuzzy: {
              maxEdits: 2,
              prefixLength: 3
            }
          }
        }
      },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 1,
          name: 1,
          genre: 1,
          location: 1,
          imageUrl: 1,
          score: { $meta: 'searchScore' }
        }
      }
    ]);

    res.send(artists);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).send({ error: 'An error occurred while searching' });
  }
});

export { router as artistRouter };