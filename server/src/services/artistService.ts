import Artist, { IArtist } from '../models/artist';
import { fuzzySearch } from '../utils/fuzzySearch';

export const searchArtists = async (query: string): Promise<IArtist[]> => {
  const artists = await Artist.find({});
  const suggestions = fuzzySearch(query, artists);
  return suggestions;
};
