import Fuse from "fuse.js";
import type { IFuseOptions } from "fuse.js";
import { IArtist } from "../models/artist";

export const fuzzySearch = (query: string, artists: IArtist[]): IArtist[] => {
  const options: IFuseOptions<IArtist> = {
    keys: ["name"],
    includeScore: true,
    threshold: 0.3, //For better Precision
    distance: 100,
    includeMatches: true,
    useExtendedSearch: true,
  };

  const fuse = new Fuse(artists, options);
  const result = fuse.search(query);

  return result.map((res) => res.item);
};
