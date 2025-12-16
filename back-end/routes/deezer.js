import { Router } from "express"
import { getArtist, getArtistTopTracks, getTrack, searchTrack } from "../controllers/deezer.js";

export const deezerRouter = Router();

deezerRouter.get("/track", getTrack);
deezerRouter.get("/search", searchTrack)
deezerRouter.get("/artist", getArtist)
deezerRouter.get("/artist/:id/top", getArtistTopTracks)