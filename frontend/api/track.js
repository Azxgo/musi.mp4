import { getTrack } from "../controllers/deezer.js";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    return getTrack(req, res);
}

