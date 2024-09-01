import mongoose, { Document, Schema } from "mongoose";

export interface IArtist extends Document {
  name: string;
  profilePhoto: string;
  genre: string;
  location: string;
}

const artistSchema: Schema = new Schema({
  name: { type: String, required: true },
  profilePhoto: { type: String, required: true },
  genre: { type: String, required: true },
  location: { type: String, required: true },
});

const Artist = mongoose.model<IArtist>("Artist", artistSchema);

export default Artist;
