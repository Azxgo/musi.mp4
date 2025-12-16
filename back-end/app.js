import express from "express";
import cors from "cors";
import 'dotenv/config'
import { deezerRouter } from "./routes/deezer.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", deezerRouter)


export default app;
