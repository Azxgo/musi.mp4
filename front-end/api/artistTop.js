import { getArtistTopTracks } from "../controllers/deezer.js";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { id } = req.query; // antes estaba en params
    if (!id) return res.status(400).json({ error: "Missing artist id" });

    // Modificar la llamada para usar id desde query
    return getArtistTopTracks({ ...req, params: { id } }, res);
}