import mongoose from "mongoose";

interface ArtistAttrs {
  name: string;
  genre: string;
  location: string;
  imageUrl: string;
}

interface ArtistDoc extends mongoose.Document {
  name: string;
  genre: string;
  location: string;
  imageUrl: string;
}

interface ArtistModel extends mongoose.Model<ArtistDoc> {
  build(attrs: ArtistAttrs): ArtistDoc;
}

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genre: { type: String, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

artistSchema.statics.build = (attrs: ArtistAttrs) => {
  return new Artist(attrs);
};

const Artist = mongoose.model<ArtistDoc, ArtistModel>("Artist", artistSchema);

export { Artist };
