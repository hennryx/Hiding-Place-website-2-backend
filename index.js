import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Visitor from "./models/visitor/VisitorSchema.js";

dotenv.config();

const app = express();

const FRONTEND_URL =
    process.env.FRONTEND_URL || "https://hiding-place-website-2.vercel.app/";

app.use(
    cors({
        origin: FRONTEND_URL,
        methods: ["GET", "POST"], // optional, specify allowed methods
        credentials: true, // if you need cookies/auth
    })
);

app.use(express.json());

connectDB().catch((Error) => {
    console.error(Error);
    process.exit(1);
});

app.get("/api/test", (req, res) => {
    res.json({ message: "API working" });
});

app.post("/api/visitor", async (req, res) => {
    try {
        const { ip } = req.body;

        if (!ip) {
            return res.status(400).json({
                success: false,
                message: "IP is required",
            });
        }

        const hashedIP = Visitor.hashIP(ip);
        const existing = await Visitor.findOne({ ip: hashedIP });

        if (!existing) {
            await Visitor.create({ ip: hashedIP });
        }

        const totalVisitors = await Visitor.countDocuments();
        res.json({ success: true, totalVisitors });
    } catch (e) {
        console.error("Error saving visitor:", e);
        res.status(500).json({ success: false });
    }
});

app.get("/api/visitor", async (req, res) => {
    try {
        const totalVisitors = await Visitor.countDocuments();
        res.json({ success: true, totalVisitors });
    } catch (e) {
        console.error("Error fetching visitors:", e);
        res.status(500).json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
